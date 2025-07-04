import {
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {
  PoModalComponent,
  PoDynamicFormComponent,
  PoStepperComponent,
  PoTableColumn,
  PoTableAction,
  PoNotificationService,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation
} from '@po-ui/ng-components';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';
import { AddSalesBudgetItemModalComponent } from '../add-sales-budget-item-modal/add-sales-budget-item-modal.component';
import { EditSalesBudgetItemModalComponent } from '../edit-sales-budget-item-modal/edit-sales-budget-item-modal.component';
import { CustomersService } from 'src/app/services/customers/customers.service';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-edit-sales-budget-header-modal',
  templateUrl: './edit-sales-budget-header-modal.component.html',
  styleUrls: ['./edit-sales-budget-header-modal.component.css']
})
export class EditSalesBudgetHeaderModalComponent {
  @ViewChild('addSalesBudgetHeaderModal', { static: true }) private modalHeader!: PoModalComponent;
  @ViewChild('addSalesBudgetItemModal', { static: true }) private addItemModal!: AddSalesBudgetItemModalComponent;
  @ViewChild('editSalesBudgetItemModal', { static: true }) private editItemModal!: EditSalesBudgetItemModalComponent;
  @ViewChild('addSalesBudgetHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;

  @Output() onEdit = new EventEmitter<any>();

  protected salesBudgetFields: any[] = [];
  protected salesBudgetValue: any = {};
  protected tableColumns: PoTableColumn[] = [];
  protected tableItems: any[] = [];
  protected removedItemsFromTableItems: any[] = [];

  protected currentStep: Step = Step.Header;

  readonly tableHeight = window.innerHeight / 3;

  readonly tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      action: this.openItemEditModal.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.removeItem.bind(this)
    }
  ];

  constructor(
    private salesBudgetsService: SalesBudgetsService,
    private poNotification: PoNotificationService,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.tableColumns = this.salesBudgetsService.GetSalesBudgetsItemsColumns();
    this.salesBudgetFields = this.salesBudgetsService.GetSalesBudgetsHeaderFields();
  }

  public async open(selectedItem: any): Promise<void> {
    this.salesBudgetValue = {
      CJ_NUM: selectedItem['orderNumber'],
      CJ_CLIENTE: selectedItem['customerCode'],
      CJ_TPFRETE: selectedItem['shippingMethod'],
      CJ_LOJA: selectedItem['store'],
    };

    await this.onChangeFields({"property": "CJ_CLIENTE", value: this.salesBudgetValue['CJ_CLIENTE']});

    this.tableItems = selectedItem['items'];
    this.currentStep = Step.Header;
    await this.calculateTaxesForItems();
    this.updateTotalsRow();
    this.modalHeader.open();
  }

  public cancel(): void {
    this.modalHeader.close();
  }

  protected canActiveNextStep(): boolean {
    if (this.currentStep === Step.Header && this.headerForm?.form?.invalid) {
      this.poNotification.error('Preencha os campos obrigatórios para prosseguir!');
      return false;
    }

    if (this.currentStep === Step.Items && (!this.tableItems || this.tableItems.length === 0)) {
      this.poNotification.error('Adicione ao menos um item para prosseguir!');
      return false;
    }

    return true;
  }

  protected onChangeStep(newStep: any): void {
    const stepLabelMap: Record<string, Step> = {
      'Cabeçalho': Step.Header,
      'Itens': Step.Items,
      'Resumo': Step.Summary
    };

    const newStepLabel = newStep['label'];
    this.currentStep = stepLabelMap[newStepLabel] ?? Step.Header;
  }

  protected openItemEditModal(selectedItem: any): void {
    this.editItemModal.open(selectedItem, this.salesBudgetValue['CJ_CLIENTE']);
  }

  protected openItemModal(): void {
    const nextItemNumber = this.getNextItemNumber();
    this.addItemModal.open(nextItemNumber, this.salesBudgetValue['CJ_CLIENTE']);
  }

  private getNextItemNumber(): string {
    if (this.tableItems.length === 0) {
      return '01';
    }

    const maxItem = Math.max(...this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR').map(item => parseInt(item['CK_ITEM'], 10) || 0));
    return (maxItem + 1).toString().padStart(2, '0');
  }

  public async onSalesBudgetItemCreated(item: any): Promise<void> {
    item.__isNew = true;
    this.removeTotalsRow();
    this.tableItems = [...this.tableItems, item];
    await this.calculateTaxesForItems();
    this.updateTotalsRow();
  }

  public async onSalesBudgetItemEdited(item: any): Promise<void> {
    this.removeTotalsRow();
    this.tableItems = this.tableItems.map(existing =>
      existing['CK_ITEM'] === item['CK_ITEM'] ? item : existing
    );
    await this.calculateTaxesForItems();
    this.updateTotalsRow();
  }

  private removeItem(itemToRemove: any): void {
    this.removeTotalsRow();
    itemToRemove['LINPOS'] = itemToRemove['CK_ITEM'];
    itemToRemove['AUTDELETA'] = 'S';
    this.removedItemsFromTableItems.push(itemToRemove);
    this.tableItems = this.tableItems.filter(item => item !== itemToRemove);
    this.updateTotalsRow();
  }

  protected isCreateButtonDisabled(): boolean {
    const isFormInvalid = this.headerForm?.form?.invalid ?? true;
    return isFormInvalid || this.tableItems.length === 0;
  }

  protected async saveSalesBudget(): Promise<void> {
    const payload = this.buildSalesBudgetPayload();

    try {
      const response = await this.salesBudgetsService.PutSalesBudget(payload);

      if (response?.codigo === 201) {
        this.modalHeader.close();
        this.poNotification.success('Registro Editado com Sucesso');
        this.removedItemsFromTableItems = [];
        this.onEdit.emit();
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao Editar pedido');
      }
    } catch (error) {
      this.poNotification.error('Erro na requisição. Tente novamente mais tarde.');
    }
  }

  private buildSalesBudgetPayload(): any {
    const payload = { ...this.salesBudgetValue };

    if (payload['CJ_EMISSAO']) {
      payload['CJ_EMISSAO'] = this.formatDateToYYYYMMDD(payload['CJ_EMISSAO']);
    }

    payload['CJ_LOJACLI'] = '01';

    const currentItems = this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR').map(item => {
      const newItem = { ...item };
      if (!newItem.__isNew) {
        newItem.LINPOS = item['CK_ITEM'];
        newItem.AUTDELETA = 'N';
        newItem.CK_OPER = '01';
      }
      return newItem;
    });

    payload['ITENS'] = [...currentItems, ...this.removedItemsFromTableItems];

    return payload;
  }

  private formatDateToYYYYMMDD(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private async calculateTaxesForItems(): Promise<void> {
    const headerData = { ...this.salesBudgetValue };

    if (headerData['CJ_EMISSAO']) {
      headerData['CJ_EMISSAO'] = this.formatDateToYYYYMMDD(headerData['CJ_EMISSAO']);
    }

    headerData['C5_LOJA'] = headerData['C5_LOJACLI'] ?? '01';
    headerData['C5_TPFRETE'] = headerData['CJ_TPFRETE'] ?? 'C';
    headerData['C5_LOJACLI'] = headerData['C5_LOJACLI'] ?? '01';
    headerData['C5_TABELA'] = headerData['C5_TABELA'] ?? '999';
    headerData['C5_TIPO'] = headerData['C5_TIPO'] ?? 'N';
    headerData['C5_CONDPAG'] = headerData['C5_CONDPAG'] ?? '002';
    headerData['C5_CLIENTE'] = headerData['CJ_CLIENTE'];
    headerData['ITENS'] = this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR');

    const response: any = await this.salesBudgetsService.GetSalesBudgetTaxes(headerData);

    if (response && Array.isArray(response.ITENS)) {
      const updatedItems = [];

      for (let i = 0; i < this.tableItems.length; i++) {
        const originalItem = this.tableItems[i];
        const updatedItem = response.ITENS[i];
        updatedItems.push({ ...originalItem, ...updatedItem });
      }

      this.tableItems = updatedItems;
      this.salesBudgetValue = headerData;
      this.updateTotalsRow();
    }
  }

  protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changedValue['property'] == "CJ_CLIENTE") {
      const selectedCustomerId = changedValue['value']['id'];
      const response: any = await this.customersService.GetCustomersItems(selectedCustomerId);
      const selectedCustomer = response[0];

      this.salesBudgetValue['customerAdress'] = selectedCustomer['adress'];
      this.salesBudgetValue['paymentCondition'] = selectedCustomer['paymentCondition'];
      this.salesBudgetValue['priceTable'] = selectedCustomer['priceTable'];
      this.salesBudgetValue['shippingMethod'] = selectedCustomer['shippingMethod'];
      this.salesBudgetValue['CJ_TPFRETE'] = selectedCustomer['shippingMethod'];
    }

    return {};
  }

  private removeTotalsRow(): void {
    this.tableItems = this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR');
  }

  private sum(items: any[], property: string): number {
    return items.reduce((acc, item) => {
      const val = parseFloat(item[property]);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }

  private buildTotalizerItem(items: any[]): any {
    return {
      CK_ITEM: 'TOTALIZADOR',
      CK_PRODUTO: '',
      B1_DESC: '',
      CK_QTDVEN: this.sum(items, 'CK_QTDVEN').toFixed(2),
      IT_PRCUNI: this.sum(items, 'IT_PRCUNI').toFixed(2),
      IT_VALMERC: this.sum(items, 'IT_VALMERC').toFixed(2),
      IT_VALICM: this.sum(items, 'IT_VALICM').toFixed(2),
      IT_VALSOL: this.sum(items, 'IT_VALSOL').toFixed(2),
      IT_VALIPI: this.sum(items, 'IT_VALIPI').toFixed(2),
      IT_DIFAL: this.sum(items, 'IT_DIFAL').toFixed(2),
      IT_SLDPROD: this.sum(items, 'IT_SLDPROD').toFixed(2)
    };
  }

  private updateTotalsRow(): void {
    this.removeTotalsRow();
    const totalRow = this.buildTotalizerItem(this.tableItems);
    this.tableItems = [...this.tableItems, totalRow];
  }
} 
