import { Component, ViewChild } from '@angular/core';
import {
  PoDynamicFormComponent,
  PoDynamicFormField,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
  PoTableComponent
} from '@po-ui/ng-components';

import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { AddSalesRequestItemModalComponent } from '../add-sales-request-item-modal/add-sales-request-item-modal.component';

@Component({
  selector: 'app-add-sales-request-header-modal',
  templateUrl: './add-sales-request-header-modal.component.html',
  styleUrls: ['./add-sales-request-header-modal.component.css']
})
export class AddSalesRequestHeaderModalComponent {
  @ViewChild('addSalesRequestHeaderModal', { static: true }) private modalHeader!: PoModalComponent;
  @ViewChild('addSalesRequestItemModal', { static: true }) private modalItem!: AddSalesRequestItemModalComponent;
  @ViewChild('addSalesRequestHeaderForm', { static: true }) private headerForm!: PoDynamicFormComponent;

  protected salesRequestFields: PoDynamicFormField[] = [];
  protected salesRequestValue: any = {};
  protected tableColumns: PoTableColumn[] = [];
  protected tableItems: any[] = [];

  readonly tableHeight = window.innerHeight / 2.2;

  readonly tableActions: PoTableAction[] = [
    /*{
      label: 'Editar',
      icon: 'po-icon-edit',
      action: () => this.openItemModal()
    },*/
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
  ) {
    this.tableColumns = this.salesRequestsService.GetSalesRequestsItemsColumns();
    this.salesRequestFields = this.salesRequestsService.GetSalesRequestsHeaderFields();
  }

  public open(): void {
    this.salesRequestValue = {};
    this.tableItems = [];
    this.modalHeader.open();
  }

  protected openItemModal(): void {
    const nextItemNumber = this.getNextItemNumber();
    this.modalItem.open(nextItemNumber);
  }
  
  private getNextItemNumber(): string {
    if (this.tableItems.length === 0) {
      return '001';
    }
  
    const maxItem = Math.max(
      ...this.tableItems.map(item => parseInt(item['C6_ITEM'], 10) || 0)
    );
  
    const nextItem = (maxItem + 1).toString().padStart(3, '0');
    return nextItem;
  }
  
  public onSalesRequestItemCreated(item: any): void {
    this.tableItems = [...this.tableItems, item];
  }

  private removeItem(itemToRemove: any): void {
    this.tableItems = this.tableItems.filter(item => item !== itemToRemove);
    this.renumberItems();
  }
  
  private renumberItems(): void {
    this.tableItems = this.tableItems.map((item, index) => ({
      ...item,
      C6_ITEM: (index + 1).toString().padStart(3, '0')
    }));
  }  

  protected isCreateButtonDisabled(): boolean {
    return !this.headerForm || this.headerForm.form.invalid || this.tableItems.length === 0;
  }

  protected async createSalesRequest(): Promise<void> {
    const requestPayload = this.buildSalesRequestPayload();

    try {
      const response = await this.salesRequestsService.PostSalesRequest(requestPayload);

      if (response?.codigo === '201') {
        this.modalHeader.close();
        this.poNotification.success('Registro Criado Com Sucesso');
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao criar pedido');
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
    payload['ITENS'] = this.tableItems;

    return payload;
  }

  private formatDateToYYYYMMDD(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
