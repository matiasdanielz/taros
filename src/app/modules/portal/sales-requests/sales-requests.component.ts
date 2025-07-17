import { Component, ViewChild } from '@angular/core';
import { PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';

import { DeleteConfirmationModalComponent } from '../../../genericComponents/delete-confirmation-modal/delete-confirmation-modal.component';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { SalesRequestHeaderModalComponent } from './modals/sales-request-header-modal/sales-request-header-modal.component';

@Component({
  selector: 'app-sales-requests',
  templateUrl: './sales-requests.component.html',
  styleUrls: ['./sales-requests.component.css']
})
export class SalesRequestsComponent {
  @ViewChild('salesRequestHeaderModal', { static: true }) salesRequestHeaderModal!: SalesRequestHeaderModalComponent;
  @ViewChild('deleteConfirmationModal', { static: true }) deleteConfirmationModal!: DeleteConfirmationModalComponent;

  protected tableHeight: number = window.innerHeight / 1.5;
  protected salesRequestsColumns: PoTableColumn[] = [];
  protected salesRequestsItems: any[] = [];
  protected selectedItemToDelete: any = {};
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  protected tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      action: this.openEditModal.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.openDeleteConfirmationModal.bind(this)
    }
  ];

  protected pageActions: PoTableAction[] = [
    {
      label: 'Adicionar',
      icon: 'po-icon-plus',
      action: () => this.salesRequestHeaderModal.open()
    }
  ];

  constructor(
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService
  ) {
    this.salesRequestsColumns = salesRequestsService.GetSalesRequestsHeaderColumns();
  }

  async ngOnInit(): Promise<void> {
    await this.loadSalesRequests();
  }

  protected async loadSalesRequests() {
    this.salesRequestsItems = await this.salesRequestsService.GetSalesRequestsItems(this.filter, '', '');
  }

  protected async openEditModal(selectedItem: any) {
    await this.salesRequestHeaderModal.open(selectedItem);
  }

  protected openDeleteConfirmationModal(selectedItem: any) {
    this.selectedItemToDelete = selectedItem;
    this.deleteConfirmationModal.open();
  }

  protected async deleteItem() {
    const requestJson = {
      C5_CLIENTE: this.selectedItemToDelete['customerCode'],
      C5_LOJACLI: this.selectedItemToDelete['store'],
      C5_NUM: this.selectedItemToDelete['orderNumber']
    };

    const response: any = await this.salesRequestsService.DeleteSalesRequest(requestJson);

    if (response?.codigo === 201) {
      this.poNotification.success('Item deletado');
      this.deleteConfirmationModal.close();
    } else {
      this.poNotification.error('Houve um erro na exclusão do item');
    }

    await this.loadSalesRequests();
  }

  protected async onSearch(filter: string): Promise<void> {
    this.page = -1;
    this.salesRequestsItems = [];
    this.filter = filter;
    await this.loadSalesRequests();
  }

  protected async onResetSearch(): Promise<void> {
    this.page = -1;
    this.salesRequestsItems = [];
    this.filter = '';
    await this.loadSalesRequests();
  }
}
