import {
  Component, EventEmitter, Output, ViewChild
} from '@angular/core';
import {
  PoModalComponent,
  PoDynamicFormComponent,
  PoTableColumn,
  PoTableAction,
  PoNotificationService,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoDynamicViewField
} from '@po-ui/ng-components';

import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { SalesRequestItemModalComponent } from '../sales-request-item-modal/sales-request-item-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sales-request-header-modal',
  templateUrl: './sales-request-header-modal.component.html',
  styleUrls: ['./sales-request-header-modal.component.css']
})
export class SalesRequestHeaderModalComponent {
  @ViewChild('salesRequestHeaderModal', { static: true }) private modal!: PoModalComponent;
  @ViewChild('salesRequestItemModal', { static: true }) private itemModal!: SalesRequestItemModalComponent;
  @ViewChild('salesRequestHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;

  @Output() onSave = new EventEmitter<any>();

  protected isEditMode = false;
  protected selectedEditItem: any = null;
  protected salesRequestItemFields: PoDynamicViewField[] = [];
  protected salesRequestItemsSum: any = {};

  protected salesRequestFields: any[] = [];
  protected salesRequestValue: any = {};
  protected tableColumns: PoTableColumn[] = [];
  protected tableItems: any[] = [];
  protected removedItemsFromTableItems: any[] = [];

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
    private customersService: CustomersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.salesRequestItemFields = this.salesRequestsService.GetSalesRequestsItemsDynamicViewFields();
    this.tableColumns = this.salesRequestsService.GetSalesRequestsItemsColumns();
    this.salesRequestFields = this.salesRequestsService.GetSalesRequestsHeaderFields();
  }

  public async open(itemToEdit?: any): Promise<void> {
    this.isEditMode = !!itemToEdit;
    this.removedItemsFromTableItems = [];

    if (this.isEditMode) {
      this.salesRequestValue = {
        C5_NUM: itemToEdit['orderNumber'],
        C5_CLIENTE: itemToEdit['customerCode'],
        C5_PEDECOM: itemToEdit['C5_PEDECOM'],
        C5_MENNOTA: itemToEdit['C5_MENNOTA'],
      };

      const data = await this.getCustomerData(itemToEdit['customerCode']);
  
      Object.assign(this.salesRequestValue, data);

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
      const customerId = changed.value?.C5_CLIENTE;
  
      const data = await this.getCustomerData(customerId);
      Object.assign(this.salesRequestValue, data);
  
      setTimeout(() => {
        return {
          value: data
        };
      }, 1000);
    }
  
    return {};
  }
  
  
  private async getCustomerData(customerId: string): Promise<any> {
    if (!customerId) {
      return {
        customerAdress: '',
        paymentCondition: '',
        paymentConditionName: '',
        priceTable: '',
        priceTableName: '',
        carrier: '',
        C5_TPFRETE: ''
      };
    }
  
    const response: any = await this.customersService.GetCustomersItems(customerId);
    const customers = response?.items ?? [];
  
    if (customers.length !== 1) {
      return {
        customerAdress: '',
        paymentCondition: '',
        paymentConditionName: '',
        priceTable: '',
        priceTableName: '',
        carrier: '',
        C5_TPFRETE: ''
      };
    }
  
    const customer = customers[0];
  
    return {
      customerAdress: customer['adress'],
      paymentCondition: customer['paymentCondition'],
      paymentConditionName: customer['paymentConditionName'],
      priceTable: customer['priceTable'],
      priceTableName: customer['priceTableName'],
      carrier: customer['carrier'],
      C5_TPFRETE: customer['C5_TPFRETE']
    };
  }  

  public openItemModal(): void {
    if(this.salesRequestValue['C5_CLIENTE'] == undefined || this.salesRequestValue['C5_CLIENTE'] == ""){
      this.poNotification.error("Selecione um Cliente Para Adicionar um item");
      return;
    }

    const nextItem = this.getNextItemNumber();
    const customerId = this.salesRequestValue['C5_CLIENTE'];
    this.itemModal.openCreate(customerId, nextItem);
  }
  

  public openItemEditModal(item: any): void {
    this.itemModal.openEdit(item);
  }

  public async onSalesRequestItemCreated(item: any): Promise<void> {
    item.__isNew = true;
    this.tableItems = [...this.tableItems, item];
    await this.calculateTaxesForItems();
  }

  public async onSalesRequestItemEdited(item: any): Promise<void> {
    this.tableItems = this.tableItems
      .map(existing => existing['C6_ITEM'] === item['C6_ITEM'] ? item : existing);
    await this.calculateTaxesForItems();
  }

  private removeItem(item: any): void {
    item.LINPOS = item['C6_ITEM'];
    item.AUTDELETA = 'S';
    this.removedItemsFromTableItems.push(item);
    this.tableItems = this.tableItems.filter(i => i !== item);
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
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
    this.salesRequestValue['C5_VEND1'] = salesmanId;

    const payload = { ...this.salesRequestValue };
    if (payload['C5_EMISSAO']) payload['C5_EMISSAO'] = this.formatDate(payload['C5_EMISSAO']);
    payload['C5_LOJACLI'] = '01';

    const items = this.tableItems
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
      ITENS: this.tableItems
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
  
    this.salesRequestItemsSum = {
      C6_QTDVEN: sum('C6_QTDVEN'),
      IT_PRCUNI: sum('IT_PRCUNI'),
      IT_VALMERC: sum('IT_VALMERC'),
      IT_VALICM: sum('IT_VALICM'),
      IT_VALSOL: sum('IT_VALSOL'),
      IT_VALIPI: sum('IT_VALIPI'),
      IT_DIFAL: sum('IT_DIFAL')
    };
  }
  

  private getNextItemNumber(): string {
    const max = Math.max(
      0,
      ...this.tableItems
        .map(i => parseInt(i.C6_ITEM, 10) || 0)
    );
    return (max + 1).toString().padStart(2, '0');
  }
  

  private formatDate(input: string | Date): string {
    const date = new Date(input);
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }
}
