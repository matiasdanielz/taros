import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { EditSalesBudgetItemModalComponent } from '../edit-sales-budget-item-modal/edit-sales-budget-item-modal.component';
import { AddSalesBudgetItemModalComponent } from '../add-sales-budget-item-modal/add-sales-budget-item-modal.component';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';
import { CustomersService } from 'src/app/services/customers/customers.service';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-add-sales-budget-header-modal',
  templateUrl: './add-sales-budget-header-modal.component.html',
  styleUrls: ['./add-sales-budget-header-modal.component.css']
})
export class AddSalesBudgetHeaderModalComponent implements OnInit {
  @ViewChild('addSalesBudgetHeaderModal', { static: true }) private modalHeader!: PoModalComponent;
  @ViewChild('addSalesBudgetItemModal', { static: true }) private addItemModal!: AddSalesBudgetItemModalComponent;
  @ViewChild('editSalesBudgetItemModal', { static: true }) private editItemModal!: EditSalesBudgetItemModalComponent;
  @ViewChild('addSalesBudgetHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;
  @ViewChild('salesBudgetStepper', { static: true }) private stepperComponent!: PoStepperComponent;

  @Output() onAdd = new EventEmitter<any>(); // <<< Emitir evento ao criar o orçamento

  protected salesBudgetFields: any[] = [];
  protected salesBudgetValue: any = {};
  protected tableColumns: PoTableColumn[] = [];
  protected tableItems: any[] = [];

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
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.salesBudgetsService.GetSalesBudgetsItemsColumns();
    this.salesBudgetFields = this.salesBudgetsService.GetSalesBudgetsHeaderFields();
  }

  public open(): void {
    this.salesBudgetValue = {};
    this.tableItems = [];
    this.currentStep = Step.Header;
    this.stepperComponent.active(0);
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

    const maxItem = Math.max(...this.tableItems
      .filter(i => i.CK_ITEM !== 'TOTALIZADOR')
      .map(item => parseInt(item['CK_ITEM'], 10) || 0));
    return (maxItem + 1).toString().padStart(2, '0');
  }

  public async onSalesBudgetItemCreated(item: any): Promise<void> {
    this.removeTotalsRow();

    this.tableItems = [...this.tableItems, item];


    const headerData = { ...this.salesBudgetValue };

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
      const updatedItems = this.tableItems.map((originalItem) => {
        if (originalItem.CK_ITEM === 'TOTALIZADOR') return originalItem;
        const matchedItem = response.ITENS.find(
          (resItem: any) => resItem['IT_ITEM'] === originalItem['CK_ITEM']
        );
        return matchedItem ? { ...originalItem, ...matchedItem } : originalItem;
      });

      this.tableItems = updatedItems;
      this.salesBudgetValue = headerData;
    }

    this.updateTotalsRow();
  }

  public onSalesBudgetItemEdited(item: any): void {
    this.removeTotalsRow();

    this.tableItems = this.tableItems.map(existing =>
      existing['CK_ITEM'] === item['CK_ITEM'] ? item : existing
    );

    this.updateTotalsRow();
  }

  private removeItem(itemToRemove: any): void {
    this.removeTotalsRow();

    this.tableItems = this.tableItems.filter(item => item !== itemToRemove);

    this.renumberItems();

    this.updateTotalsRow();
  }

  private renumberItems(): void {
    this.tableItems = this.tableItems
      .filter(i => i.CK_ITEM !== 'TOTALIZADOR')
      .map((item, index) => ({
        ...item,
        CK_ITEM: (index + 1).toString().padStart(2, '0')
      }));

    this.updateTotalsRow();
  }

  protected isCreateButtonDisabled(): boolean {
    const isFormInvalid = this.headerForm?.form?.invalid ?? true;
    return isFormInvalid || this.tableItems.length === 0;
  }

  protected async createSalesBudget(): Promise<void> {
    const payload = this.buildSalesBudgetPayload();

    try {
      const response = await this.salesBudgetsService.PostSalesBudget(payload);

      if (response?.codigo === 201) {
        this.modalHeader.close();
        this.poNotification.success('Registro Criado com Sucesso');
        this.onAdd.emit();
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao criar orçamento');
      }
    } catch (error) {
      this.poNotification.error('Erro na requisição. Tente novamente mais tarde.');
    }
  }

  private buildSalesBudgetPayload(): any {
    const payload = { ...this.salesBudgetValue };

    payload['CJ_LOJA'] = '01';

    const filteredItems = this.tableItems.filter(i => i.CK_ITEM !== 'TOTALIZADOR');

    payload['ITENS'] = filteredItems.map(item => ({
      CK_ITEM: item.IT_ITEM,
      CK_OPER: '01',
      CK_PRODUTO: item.IT_PRODUTO.trim(),
      CK_QTDVEN: item.IT_QUANT
    }));

    return payload;
  }

  protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changedValue['property'] == "CJ_CLIENTE") {
      const selectedCustomerId = changedValue['value']['id'];
      const response: any = await this.customersService.GetCustomersItems(selectedCustomerId);
      const selectedCustomer = response[0];

      this.salesBudgetValue['customerAdress'] = selectedCustomer['adress'];
      this.salesBudgetValue['paymentCondition'] = selectedCustomer['paymentCondition'];
      this.salesBudgetValue['priceTable'] = selectedCustomer['priceTable'];
      this.salesBudgetValue['carrier'] = selectedCustomer['carrier'];
      this.salesBudgetValue['CJ_TPFRETE'] = selectedCustomer['C5_TPFRETE'];
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
      CK_QTDVEN: this.sum(items, 'CK_QTDVEN'),
      IT_PRCUNI: this.sum(items, 'IT_PRCUNI'),
      IT_VALMERC: this.sum(items, 'IT_VALMERC'),
      IT_VALICM: this.sum(items, 'IT_VALICM'),
      IT_VALSOL: this.sum(items, 'IT_VALSOL'),
      IT_VALIPI: this.sum(items, 'IT_VALIPI'),
      IT_DIFAL: this.sum(items, 'IT_DIFAL'),
      IT_SLDPROD: this.sum(items, 'IT_SLDPROD')
    };
  }

  private updateTotalsRow(): void {
    this.removeTotalsRow();

    const totalRow = this.buildTotalizerItem(this.tableItems);

    this.tableItems = [...this.tableItems, totalRow];
  }
}
