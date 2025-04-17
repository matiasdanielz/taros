import { Component, ViewChild } from '@angular/core';
import { PoDynamicViewField, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { AddSalesRequestHeaderModalComponent } from './modals/add-sales-request-header-modal/add-sales-request-header-modal.component';
import { DeleteConfirmationModalComponent } from '../../../genericComponents/delete-confirmation-modal/delete-confirmation-modal.component';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { EditSalesRequestHeaderModalComponent } from './modals/edit-sales-request-header-modal/edit-sales-request-header-modal.component';

@Component({
  selector: 'app-sales-requests',
  templateUrl: './sales-requests.component.html',
  styleUrls: ['./sales-requests.component.css']
})
export class SalesRequestsComponent {
  @ViewChild('addSalesRequestHeaderModal', {static: true}) addSalesRequestHeaderModal!: AddSalesRequestHeaderModalComponent;
  @ViewChild('editSalesRequestHeaderModal', {static: true}) editSalesRequestHeaderModal!: EditSalesRequestHeaderModalComponent;
  @ViewChild('deleteConfirmationModal', {static: true}) deleteConfirmationModal!: DeleteConfirmationModalComponent;

  //Parametros da pagina
  protected pageActions: PoTableAction[] = [
    {
      label: 'Adicionar',
      action: () => this.addSalesRequestHeaderModal.open()
    },
  ];

  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      action: this.OpenSalesRequestEditModal.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.OpenDeleteConfirmationModal.bind(this)
    }
  ];

  //Itens Da Tabela De Clientes
  protected salesRequestsColumns: PoTableColumn[] = [];
  protected salesRequestsItems: any[] = [];
  protected salesRequestsFields: PoDynamicViewField[] = [];
  protected currentSalesRequestInView: any = {};
  protected selectedItemToDelete: any = {};
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService
  ){
    this.salesRequestsColumns = salesRequestsService.GetSalesRequestsHeaderColumns();
    this.salesRequestsFields = salesRequestsService.GetSalesRequestsHeaderFields();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadSalesRequests();
  }

  protected async LoadSalesRequests(){
    this.salesRequestsItems = await this.salesRequestsService.GetSalesRequestsItems(this.page, this.pageSize, this.filter);
  }

  protected OpenSalesRequestEditModal(selectedItem: any){
    this.editSalesRequestHeaderModal.open(selectedItem);
  }

  protected OpenDeleteConfirmationModal(selectedItem: any){
    this.selectedItemToDelete = selectedItem;

    this.deleteConfirmationModal.open();
  }

  protected async DeleteItem(){
    const requestJson = {
      "C5_CLIENTE": this.selectedItemToDelete['customerCode'],
      "C5_LOJACLI": this.selectedItemToDelete['store'],
      "C5_NUM": this.selectedItemToDelete['orderNumber']
    };

    const response: any = await this.salesRequestsService.DeleteSalesRequest(requestJson);

    if(response['codigo'] == "201"){
      this.poNotification.success("Item deletado");
      this.deleteConfirmationModal.close();
    }else{
      this.poNotification.error("Houve um erro na exclusão do item");
    }

    this.LoadSalesRequests();
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.salesRequestsItems = [];
    this.filter = filter
    this.LoadSalesRequests()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.salesRequestsItems = [];
    this.filter = ''
    this.LoadSalesRequests()
  }
}
