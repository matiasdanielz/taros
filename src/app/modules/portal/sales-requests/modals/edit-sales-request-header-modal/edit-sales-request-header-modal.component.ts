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
  PoNotificationService
} from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { AddSalesRequestItemModalComponent } from '../add-sales-request-item-modal/add-sales-request-item-modal.component';
import { EditSalesRequestItemModalComponent } from '../edit-sales-request-item-modal/edit-sales-request-item-modal.component';

enum Step {
  Header = 0,
  Items = 1,
  Summary = 2
}

@Component({
  selector: 'app-edit-sales-request-header-modal',
  templateUrl: './edit-sales-request-header-modal.component.html',
  styleUrls: ['./edit-sales-request-header-modal.component.css']
})
export class EditSalesRequestHeaderModalComponent {
  @ViewChild('addSalesRequestHeaderModal', { static: true }) private modalHeader!: PoModalComponent;
  @ViewChild('addSalesRequestItemModal', { static: true }) private addItemModal!: AddSalesRequestItemModalComponent;
  @ViewChild('editSalesRequestItemModal', { static: true }) private editItemModal!: EditSalesRequestItemModalComponent;
  @ViewChild('addSalesRequestHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;

  @Output() onEdit = new EventEmitter<any>();

  protected salesRequestFields: any[] = [];
  protected salesRequestValue: any = {};
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
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService
  ) { }

  ngOnInit(): void {
    this.tableColumns = this.salesRequestsService.GetSalesRequestsItemsColumns();
    this.salesRequestFields = this.salesRequestsService.GetSalesRequestsHeaderFields();
  }

  public async open(selectedItem: any): Promise<void> {
    this.salesRequestValue = {
      C5_NUM: selectedItem['orderNumber'],
      C5_CLIENTE: selectedItem['customerCode'],
      C5_TPFRETE: selectedItem['shippingMethod']
    };

    this.tableItems = selectedItem['items'];
    this.currentStep = Step.Header;
    await this.calculateTaxesForItems();
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
    this.addItemModal.open(nextItemNumber);
  }

  private getNextItemNumber(): string {
    if (this.tableItems.length === 0) {
      return '01';
    }

    const maxItem = Math.max(...this.tableItems.map(item => parseInt(item['C6_ITEM'], 10) || 0));
    return (maxItem + 1).toString().padStart(2, '0');
  }

  public async onSalesRequestItemCreated(item: any): Promise<void> {
    item.__isNew = true;
    this.tableItems = [...this.tableItems, item];
    await this.calculateTaxesForItems();
  }

  public async onSalesRequestItemEdited(item: any): Promise<void> {
    this.tableItems = this.tableItems.map(existing =>
      existing['C6_ITEM'] === item['C6_ITEM'] ? item : existing
    );
    await this.calculateTaxesForItems();
  }

  private removeItem(itemToRemove: any): void {
    itemToRemove['LINPOS'] = itemToRemove['C6_ITEM'];
    itemToRemove['AUTDELETA'] = 'S';
    this.removedItemsFromTableItems.push(itemToRemove);
    this.tableItems = this.tableItems.filter(item => item !== itemToRemove);
  }

  protected isCreateButtonDisabled(): boolean {
    const isFormInvalid = this.headerForm?.form?.invalid ?? true;
    return isFormInvalid || this.tableItems.length === 0;
  }

  protected async saveSalesRequest(): Promise<void> {
    const payload = this.buildSalesRequestPayload();

    try {
      const response = await this.salesRequestsService.PutSalesRequest(payload);

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

  private buildSalesRequestPayload(): any {
    const payload = { ...this.salesRequestValue };

    if (payload['C5_EMISSAO']) {
      payload['C5_EMISSAO'] = this.formatDateToYYYYMMDD(payload['C5_EMISSAO']);
    }

    payload['C5_LOJACLI'] = '01';

    const currentItems = this.tableItems.map(item => {
      const newItem = { ...item };
      if (!newItem.__isNew) {
        newItem.LINPOS = item['C6_ITEM'];
        newItem.AUTDELETA = 'N';
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
    const headerData = { ...this.salesRequestValue };

    if (headerData['C5_EMISSAO']) {
      headerData['C5_EMISSAO'] = this.formatDateToYYYYMMDD(headerData['C5_EMISSAO']);
    }

    headerData['C5_LOJACLI'] = '01';
    headerData['C5_TABELA'] = headerData['C5_TABELA'] ?? '999';
    headerData['C5_TIPO'] = headerData['C5_TIPO'] ?? 'N';
    headerData['C5_TPFRETE'] = headerData['C5_TPFRETE'] ?? 'C';
    headerData['C5_CONDPAG'] = headerData['C5_CONDPAG'] ?? '002';
    headerData['ITENS'] = this.tableItems;

    const response: any = await this.salesRequestsService.GetSalesRequestTaxes(headerData);

    if (response && Array.isArray(response.ITENS)) {
      const updatedItems = [];

      for (let i = 0; i < this.tableItems.length; i++) {
        const originalItem = this.tableItems[i];
        const updatedItem = response.ITENS[i];
        updatedItems.push({ ...originalItem, ...updatedItem });
      }

      this.tableItems = updatedItems;
      this.salesRequestValue = headerData;
    }
  }
}