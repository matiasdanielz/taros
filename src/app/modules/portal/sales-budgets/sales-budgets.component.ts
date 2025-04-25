import { Component, ViewChild } from '@angular/core';
import { PoTableAction, PoTableColumn, PoDynamicViewField, PoNotificationService } from '@po-ui/ng-components';
import { DeleteConfirmationModalComponent } from 'src/app/genericComponents/delete-confirmation-modal/delete-confirmation-modal.component';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { AddSalesBudgetHeaderModalComponent } from './modals/add-sales-budget-header-modal/add-sales-budget-header-modal.component';
import { EditSalesBudgetHeaderModalComponent } from './modals/edit-sales-budget-header-modal/edit-sales-budget-header-modal.component';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';

@Component({
  selector: 'app-sales-budgets',
  templateUrl: './sales-budgets.component.html',
  styleUrls: ['./sales-budgets.component.css']
})
export class SalesBudgetsComponent {
  @ViewChild('addSalesBudgetHeaderModal', { static: true }) addSalesBudgetHeaderModal!: AddSalesBudgetHeaderModalComponent;
  @ViewChild('editSalesBudgetHeaderModal', { static: true }) editSalesBudgetHeaderModal!: EditSalesBudgetHeaderModalComponent;
  @ViewChild('deleteConfirmationModal', { static: true }) deleteConfirmationModal!: DeleteConfirmationModalComponent;

  //Parametros da pagina
  protected pageActions: PoTableAction[] = [
    {
      label: 'Adicionar',
      action: () => this.addSalesBudgetHeaderModal.open()
    },
  ];

  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      action: this.OpenSalesBudgetEditModal.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.OpenDeleteConfirmationModal.bind(this)
    }
  ];

  //Itens Da Tabela De Clientes
  protected salesBudgetsColumns: PoTableColumn[] = [];
  protected salesBudgetsItems: any[] = [];
  protected salesBudgetsFields: PoDynamicViewField[] = [];
  protected currentSalesBudgetInView: any = {};
  protected selectedItemToDelete: any = {};
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private salesBudgetsService: SalesBudgetsService,
    private poNotification: PoNotificationService
  ) {
    this.salesBudgetsColumns = salesBudgetsService.GetSalesBudgetsHeaderColumns();
    this.salesBudgetsFields = salesBudgetsService.GetSalesBudgetsHeaderFields();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadSalesBudgets();
  }

  protected async LoadSalesBudgets() {
    this.salesBudgetsItems = await this.salesBudgetsService.GetSalesBudgetsItems(this.filter);
  }

  protected OpenSalesBudgetEditModal(selectedItem: any) {
    this.editSalesBudgetHeaderModal.open(selectedItem);
  }

  protected OpenDeleteConfirmationModal(selectedItem: any) {
    this.selectedItemToDelete = selectedItem;

    this.deleteConfirmationModal.open();
  }

  protected async DeleteItem() {
    const requestJson = {
      "C5_CLIENTE": this.selectedItemToDelete['customerCode'],
      "C5_LOJACLI": this.selectedItemToDelete['store'],
      "C5_NUM": this.selectedItemToDelete['orderNumber']
    };

    const response: any = await this.salesBudgetsService.DeleteSalesBudget(requestJson);

    if (response['codigo'] == "201") {
      this.poNotification.success("Item deletado");
      this.deleteConfirmationModal.close();
    } else {
      this.poNotification.error("Houve um erro na exclusão do item");
    }

    this.LoadSalesBudgets();
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.salesBudgetsItems = [];
    this.filter = filter
    this.LoadSalesBudgets()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.salesBudgetsItems = [];
    this.filter = ''
    this.LoadSalesBudgets()
  }
}
