import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  PoDynamicFormComponent,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoModalComponent,
  PoNotificationService,
  PoStepperComponent,
  PoTableAction,
  PoTableColumn
} from '@po-ui/ng-components';

import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { AddSalesRequestItemModalComponent } from '../add-sales-request-item-modal/add-sales-request-item-modal.component';
import { EditSalesRequestItemModalComponent } from '../edit-sales-request-item-modal/edit-sales-request-item-modal.component';
import { CustomersService } from 'src/app/services/customers/customers.service';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-add-sales-request-header-modal',
  templateUrl: './add-sales-request-header-modal.component.html',
  styleUrls: ['./add-sales-request-header-modal.component.css']
})
export class AddSalesRequestHeaderModalComponent implements OnInit {
  @ViewChild('addSalesRequestHeaderModal', { static: true }) private modalHeader!: PoModalComponent;
  @ViewChild('addSalesRequestItemModal', { static: true }) private addItemModal!: AddSalesRequestItemModalComponent;
  @ViewChild('editSalesRequestItemModal', { static: true }) private editItemModal!: EditSalesRequestItemModalComponent;
  @ViewChild('addSalesRequestHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;
  @ViewChild('salesRequestStepper', { static: true }) private stepperComponent!: PoStepperComponent;

  @Output() onAdd = new EventEmitter<any>();

  protected salesRequestFields: any[] = [];
  protected salesRequestValue: any = {};
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
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.salesRequestsService.GetSalesRequestsItemsColumns();
    this.salesRequestFields = this.salesRequestsService.GetSalesRequestsHeaderFields();
  }

  public open(): void {
    this.salesRequestValue = {};
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
    this.editItemModal.open(selectedItem);
  }

  protected openItemModal(): void {
    const nextItemNumber = this.getNextItemNumber();
    this.addItemModal.open(nextItemNumber, this.salesRequestValue['C5_CLIENTE']);
  }

  private getNextItemNumber(): string {
    if (this.tableItems.length === 0) {
      return '01';
    }

    const maxItem = Math.max(...this.tableItems.map(item => parseInt(item['C6_ITEM'], 10) || 0));
    return (maxItem + 1).toString().padStart(2, '0');
  }

  public async onSalesRequestItemCreated(item: any): Promise<void> {
    this.tableItems = [...this.tableItems.filter(i => i.C6_ITEM !== 'TOTALIZADOR'), item];

    const headerData = this.buildHeaderData();
    headerData['ITENS'] = this.tableItems;

    const response: any = await this.salesRequestsService.GetSalesRequestTaxes(headerData);

    if (response && Array.isArray(response.ITENS)) {
      const updatedItems = this.tableItems.map((originalItem) => {
        const matchedItem = response.ITENS.find(
          (resItem: any) => resItem['IT_ITEM'] === originalItem['C6_ITEM']
        );
        return matchedItem ? { ...originalItem, ...matchedItem } : originalItem;
      });

      this.tableItems = [...updatedItems, this.buildTotalizerItem(updatedItems)];
      this.salesRequestValue = headerData;
    }
  }

  public onSalesRequestItemEdited(item: any): void {
    const filtered = this.tableItems.filter(i => i.C6_ITEM !== 'TOTALIZADOR');
    this.tableItems = filtered.map(existing => existing['C6_ITEM'] === item['C6_ITEM'] ? item : existing);
    this.tableItems = [...this.tableItems, this.buildTotalizerItem(this.tableItems)];
  }

  private removeItem(itemToRemove: any): void {
    this.tableItems = this.tableItems.filter(item => item !== itemToRemove && item.C6_ITEM !== 'TOTALIZADOR');
    this.renumberItems();
    this.tableItems = [...this.tableItems, this.buildTotalizerItem(this.tableItems)];
  }

  private renumberItems(): void {
    this.tableItems = this.tableItems.map((item, index) => ({
      ...item,
      C6_ITEM: (index + 1).toString().padStart(2, '0')
    }));
  }

  private buildTotalizerItem(items: any[]): any {
    const total = {
      C6_ITEM: 'TOTALIZADOR',
      C6_PRODUTO: '',
      B1_DESC: '',
      C6_QTDVEN: this.sum(items, 'C6_QTDVEN'),
      IT_PRCUNI: this.sum(items, 'IT_PRCUNI'),
      IT_VALMERC: this.sum(items, 'IT_VALMERC'),
      IT_VALICM: this.sum(items, 'IT_VALICM'),
      IT_VALSOL: this.sum(items, 'IT_VALSOL'),
      IT_VALIPI: this.sum(items, 'IT_VALIPI'),
      IT_DIFAL: this.sum(items, 'IT_DIFAL'),
      IT_SLDPROD: this.sum(items, 'IT_SLDPROD')
    };
    return total;
  }

  private sum(items: any[], prop: string): number {
    return items.reduce((acc, item) => acc + (parseFloat(item[prop]) || 0), 0);
  }

  protected isCreateButtonDisabled(): boolean {
    const isFormInvalid = this.headerForm?.form?.invalid ?? true;
    return isFormInvalid || this.tableItems.length === 0;
  }

  protected async createSalesRequest(): Promise<void> {
    const payload = this.buildSalesRequestPayload();

    try {
      const response = await this.salesRequestsService.PostSalesRequest(payload);

      if (response?.codigo === 201) {
        this.modalHeader.close();
        this.poNotification.success('Registro Criado com Sucesso');
        this.onAdd.emit();
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao criar pedido');
      }
    } catch (error) {
      this.poNotification.error('Erro na requisição. Tente novamente mais tarde.');
    }
  }

  private buildSalesRequestPayload(): any {
    const payload = { ...this.salesRequestValue };
    payload['C5_LOJACLI'] = '01';
    payload['ITENS'] = this.tableItems.filter(item => item.C6_ITEM !== 'TOTALIZADOR');
    return payload;
  }

  private buildHeaderData(): any {
    return {
      ...this.salesRequestValue,
      C5_LOJACLI: '01',
      C5_TABELA: this.salesRequestValue['C5_TABELA'] ?? '999',
      C5_TIPO: this.salesRequestValue['C5_TIPO'] ?? 'N',
      C5_TPFRETE: this.salesRequestValue['C5_TPFRETE'] ?? 'C',
      C5_CONDPAG: this.salesRequestValue['C5_CONDPAG'] ?? '002'
    };
  }

  protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changedValue['property'] === 'C5_CLIENTE') {
      const selectedCustomerId = changedValue['value']['id'];
      const response: any = await this.customersService.GetCustomersItems(selectedCustomerId);
      const selectedCustomer = response[0];

      this.salesRequestValue['customerAdress'] = selectedCustomer['adress'];
      this.salesRequestValue['paymentCondition'] = selectedCustomer['paymentCondition'];
      this.salesRequestValue['priceTable'] = selectedCustomer['priceTable'];
      this.salesRequestValue['carrier'] = selectedCustomer['carrier'];
      this.salesRequestValue['C5_TPFRETE'] = selectedCustomer['C5_TPFRETE'];
    }

    return {};
  }
}
