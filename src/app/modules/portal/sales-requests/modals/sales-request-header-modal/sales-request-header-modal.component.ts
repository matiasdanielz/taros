import {
  Component, EventEmitter, Output, ViewChild
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

import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { SalesRequestItemModalComponent } from '../sales-request-item-modal/sales-request-item-modal.component';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-sales-request-header-modal',
  templateUrl: './sales-request-header-modal.component.html',
  styleUrls: ['./sales-request-header-modal.component.css']
})
export class SalesRequestHeaderModalComponent {
  @ViewChild('salesRequestHeaderModal', { static: true }) private modal!: PoModalComponent;
  @ViewChild('salesRequestItemModal', { static: true }) private itemModal!: SalesRequestItemModalComponent;
  @ViewChild('salesRequestHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;
  @ViewChild('salesRequestStepper', { static: true }) private stepperComponent!: PoStepperComponent;

  @Output() onSave = new EventEmitter<any>();

  isEditMode = false;
  currentStep: Step = Step.Header;
  selectedEditItem: any = null;

  salesRequestFields: any[] = [];
  salesRequestValue: any = {};
  tableColumns: PoTableColumn[] = [];
  tableItems: any[] = [];
  removedItemsFromTableItems: any[] = [];

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
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.salesRequestsService.GetSalesRequestsItemsColumns();
    this.salesRequestFields = this.salesRequestsService.GetSalesRequestsHeaderFields();
  }

  public open(itemToEdit?: any): void {
    this.isEditMode = !!itemToEdit;
    this.currentStep = Step.Header;
    this.stepperComponent.active(0);
    this.removedItemsFromTableItems = [];

    if (this.isEditMode) {
      this.salesRequestValue = {
        C5_NUM: itemToEdit['orderNumber'],
        C5_CLIENTE: itemToEdit['customerCode']
      };
      this.tableItems = itemToEdit['items'];
      this.calculateTaxesForItems().then(() => {
        this.addTotalizerRow();
        this.modal.open();
      });
    } else {
      this.salesRequestValue = {};
      this.tableItems = [];
      this.modal.open();
    }
  }

  public cancel(): void {
    this.modal.close();
  }

  public onSubmit(): void {
    this.isEditMode ? this.saveSalesRequest() : this.createSalesRequest();
  }

  public isSubmitButtonDisabled(): boolean {
    const isFormInvalid = this.headerForm?.form?.invalid ?? true;
    return isFormInvalid || this.tableItems.length === 0;
  }

  public async onChangeFields(changed: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changed.property === 'C5_CLIENTE') {
      const id = changed.value?.id;
      const response: any = await this.customersService.GetCustomersItems(id);
      const customer = response[0];
      if (!customer) return {};

      this.salesRequestValue['customerAdress'] = customer['adress'];
      this.salesRequestValue['paymentCondition'] = customer['paymentCondition'];
      this.salesRequestValue['priceTable'] = customer['priceTable'];
      this.salesRequestValue['shippingMethod'] = customer['shippingMethod'];
      this.salesRequestValue['C5_TPFRETE'] = customer['shippingMethod'];
    }

    return {};
  }

  public onChangeStep(event: any): void {
    const labelMap: Record<string, Step> = {
      'Cabeçalho': Step.Header,
      'Itens': Step.Items,
      'Resumo': Step.Summary
    };
    this.currentStep = labelMap[event.label] ?? Step.Header;
  }

  public canActiveNextStep(): boolean {
    if (this.currentStep === Step.Header && this.headerForm?.form?.invalid) {
      this.poNotification.error('Preencha os campos obrigatórios!');
      return false;
    }

    if (this.currentStep === Step.Items && this.tableItems.length === 0) {
      this.poNotification.error('Adicione ao menos um item!');
      return false;
    }

    return true;
  }

  public openItemModal(): void {
    const nextItem = this.getNextItemNumber();
    const customerId = this.salesRequestValue['C5_CLIENTE'];
    this.itemModal.openCreate(customerId, nextItem);
  }
  

  public openItemEditModal(item: any): void {
    this.itemModal.openEdit(item);
  }

  public async onSalesRequestItemCreated(item: any): Promise<void> {
    item.__isNew = true;
    this.tableItems = [...this.tableItems.filter(i => i.C6_ITEM !== 'TOTALIZADOR'), item];
    await this.calculateTaxesForItems();
  }

  public async onSalesRequestItemEdited(item: any): Promise<void> {
    this.tableItems = this.tableItems
      .filter(i => i.C6_ITEM !== 'TOTALIZADOR')
      .map(existing => existing['C6_ITEM'] === item['C6_ITEM'] ? item : existing);
    await this.calculateTaxesForItems();
  }

  private removeItem(item: any): void {
    item.LINPOS = item['C6_ITEM'];
    item.AUTDELETA = 'S';
    this.removedItemsFromTableItems.push(item);
    this.tableItems = this.tableItems.filter(i => i !== item && i.C6_ITEM !== 'TOTALIZADOR');
    this.addTotalizerRow();
  }

  private async createSalesRequest(): Promise<void> {
    const payload = this.buildPayload();
    const response = await this.salesRequestsService.PostSalesRequest(payload);

    if (response?.codigo === 201) {
      this.modal.close();
      this.poNotification.success('Registro Criado com Sucesso');
      this.onSave.emit();
    } else {
      this.poNotification.error(response?.mensagem || 'Erro ao criar pedido');
    }
  }

  private async saveSalesRequest(): Promise<void> {
    const payload = this.buildPayload(true);
    const response = await this.salesRequestsService.PutSalesRequest(payload);

    if (response?.codigo === 201) {
      this.modal.close();
      this.poNotification.success('Registro Editado com Sucesso');
      this.removedItemsFromTableItems = [];
      this.onSave.emit();
    } else {
      this.poNotification.error(response?.mensagem || 'Erro ao editar pedido');
    }
  }

  private buildPayload(isEdit: boolean = false): any {
    const payload = { ...this.salesRequestValue };
    if (payload['C5_EMISSAO']) payload['C5_EMISSAO'] = this.formatDate(payload['C5_EMISSAO']);
    payload['C5_LOJACLI'] = '01';

    const items = this.tableItems
      .filter(i => i.C6_ITEM !== 'TOTALIZADOR')
      .map(item => {
        const newItem = { ...item };
        if (isEdit && !newItem.__isNew) {
          newItem.LINPOS = newItem['C6_ITEM'];
          newItem.AUTDELETA = 'N';
        }
        return newItem;
      });

    if (isEdit) {
      payload['ITENS'] = [...items, ...this.removedItemsFromTableItems];
    } else {
      payload['ITENS'] = items;
    }

    return payload;
  }

  private async calculateTaxesForItems(): Promise<void> {
    const headerData = {
      ...this.salesRequestValue,
      C5_LOJACLI: '01',
      C5_TABELA: this.salesRequestValue['C5_TABELA'] ?? '999',
      C5_TIPO: this.salesRequestValue['C5_TIPO'] ?? 'N',
      C5_TPFRETE: this.salesRequestValue['C5_TPFRETE'] ?? 'C',
      C5_CONDPAG: this.salesRequestValue['C5_CONDPAG'] ?? '002',
      ITENS: this.tableItems.filter(i => i.C6_ITEM !== 'TOTALIZADOR')
    };

    if (headerData['C5_EMISSAO']) {
      headerData['C5_EMISSAO'] = this.formatDate(headerData['C5_EMISSAO']);
    }

    const response = await this.salesRequestsService.GetSalesRequestTaxes(headerData);

    if (response?.ITENS) {
      const updatedItems = headerData.ITENS.map((originalItem: any, index: number) => ({
        ...originalItem,
        ...response.ITENS[index]
      }));
      this.tableItems = [...updatedItems];
      this.salesRequestValue = headerData;
      this.addTotalizerRow();
    }
  }

  private addTotalizerRow(): void {
    const sum = (field: string) => this.tableItems.reduce((acc, item) =>
      acc + (parseFloat(item[field]) || 0), 0);

    this.tableItems = this.tableItems.filter(i => i.C6_ITEM !== 'TOTALIZADOR');
    this.tableItems.push({
      C6_ITEM: 'TOTALIZADOR',
      B1_DESC: 'TOTALIZADOR',
      C6_QTDVEN: sum('C6_QTDVEN'),
      IT_PRCUNI: sum('IT_PRCUNI'),
      IT_VALMERC: sum('IT_VALMERC'),
      IT_VALICM: sum('IT_VALICM'),
      IT_VALSOL: sum('IT_VALSOL'),
      IT_VALIPI: sum('IT_VALIPI'),
      IT_DIFAL: sum('IT_DIFAL')
    });
  }

  private getNextItemNumber(): string {
    const max = Math.max(
      0,
      ...this.tableItems
        .filter(i => i.C6_ITEM !== 'TOTALIZADOR')
        .map(i => parseInt(i.C6_ITEM, 10) || 0)
    );
    return (max + 1).toString().padStart(2, '0');
  }
  

  private formatDate(input: string | Date): string {
    const date = new Date(input);
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }
}
