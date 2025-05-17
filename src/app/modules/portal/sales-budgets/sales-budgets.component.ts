import { Component, ViewChild } from '@angular/core';
import { PoTableAction, PoTableColumn, PoDynamicViewField, PoNotificationService, PoModalComponent } from '@po-ui/ng-components';
import { DeleteConfirmationModalComponent } from 'src/app/genericComponents/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddSalesBudgetHeaderModalComponent } from './modals/add-sales-budget-header-modal/add-sales-budget-header-modal.component';
import { EditSalesBudgetHeaderModalComponent } from './modals/edit-sales-budget-header-modal/edit-sales-budget-header-modal.component';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sales-budgets',
  templateUrl: './sales-budgets.component.html',
  styleUrls: ['./sales-budgets.component.css']
})
export class SalesBudgetsComponent {
  // ViewChilds
  @ViewChild('addSalesBudgetHeaderModal', { static: true }) addSalesBudgetHeaderModal!: AddSalesBudgetHeaderModalComponent;
  @ViewChild('editSalesBudgetHeaderModal', { static: true }) editSalesBudgetHeaderModal!: EditSalesBudgetHeaderModalComponent;
  @ViewChild('deleteConfirmationModal', { static: true }) deleteConfirmationModal!: DeleteConfirmationModalComponent;
  @ViewChild('salesBudgetAprovalModal', { static: true }) salesBudgetAprovalModal!: PoModalComponent;

  // Ações da Página
  protected pageActions: PoTableAction[] = [
    {
      label: 'Adicionar',
      action: () => this.addSalesBudgetHeaderModal.open()
    },
  ];

  // Ações da Tabela
  protected tableActions: PoTableAction[] = [
    {
      label: 'Aprovar Orçamento',
      icon: 'po-icon-ok',
      action: this.openSalesBudgetAprovalModal.bind(this)
    },
    {
      label: 'Editar',
      icon: 'po-icon-edit',
      separator: true,
      action: this.openSalesBudgetEditModal.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.openDeleteConfirmationModal.bind(this)
    }
  ];

  // Parâmetros da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected salesBudgetsColumns: PoTableColumn[] = [];
  protected salesBudgetsItems: any[] = [];

  // Campos de Visualização
  protected salesBudgetsFields: PoDynamicViewField[] = [];
  protected currentSalesBudgetInView: any = {};
  protected selectedItemToDelete: any = {};

  // Controle de Paginação e Filtro
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';


  // Serviços
  constructor(
    private salesBudgetsService: SalesBudgetsService,
    private poNotification: PoNotificationService,
    private cookieService: CookieService
  ) {
    this.salesBudgetsColumns = this.salesBudgetsService.GetSalesBudgetsHeaderColumns();
    this.salesBudgetsFields = this.salesBudgetsService.GetSalesBudgetsHeaderFields();
  }

  // Ciclo de Vida
  async ngOnInit(): Promise<void> {
    await this.loadSalesBudgets();
  }

  // Métodos de Ação
  protected async loadSalesBudgets(): Promise<void> {
    this.salesBudgetsItems = await this.salesBudgetsService.GetSalesBudgetsItems(this.filter);
  }

  protected openSalesBudgetEditModal(selectedItem: any): void {
    this.editSalesBudgetHeaderModal.open(selectedItem);
  }

  protected openDeleteConfirmationModal(selectedItem: any): void {
    this.selectedItemToDelete = selectedItem;
    this.deleteConfirmationModal.open();
  }

  protected openSalesBudgetAprovalModal(selectedItem: any) {
    this.currentSalesBudgetInView = selectedItem;
    this.salesBudgetAprovalModal.open();
  }

  protected async aproveSalesBudget() {
    const salesmanId = localStorage.getItem('salesmanId');
    const requestJson = {
      "vendedor": salesmanId,
      "CJ_NUM": this.currentSalesBudgetInView['orderNumber']
    };

    const response: any = await this.salesBudgetsService.AproveSalesBudget(requestJson);

    if(response['codigo'] == 201){
      this.poNotification.success('Registro Aprovado Com Sucesso');
      await this.loadSalesBudgets();
      this.salesBudgetAprovalModal.close();
    }else{
      this.poNotification.error(response['mensagem']);
    }
  }

  protected async deleteItem(): Promise<void> {
    const requestJson = {
      "CJ_CLIENTE": this.selectedItemToDelete['customerCode'],
      "CJ_LOJA": this.selectedItemToDelete['store'],
      "CJ_NUM": this.selectedItemToDelete['orderNumber']
    };

    const response: any = await this.salesBudgetsService.DeleteSalesBudget(requestJson);

    if (response['codigo'] === 201) {
      this.poNotification.success("Item deletado");
      this.deleteConfirmationModal.close();
    } else {
      this.poNotification.error("Houve um erro na exclusão do item");
    }

    await this.loadSalesBudgets();
  }

  // Métodos de Pesquisa
  protected async onSearch(filter: string): Promise<void> {
    this.page = -1;
    this.salesBudgetsItems = [];
    this.filter = filter;
    await this.loadSalesBudgets();
  }

  protected async onResetSearch(): Promise<void> {
    this.page = -1;
    this.salesBudgetsItems = [];
    this.filter = '';
    await this.loadSalesBudgets();
  }
}
