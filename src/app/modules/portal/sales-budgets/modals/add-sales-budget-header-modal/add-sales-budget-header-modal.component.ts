import { Component, ViewChild } from '@angular/core';
import { PoDynamicFormComponent, PoDynamicFormField, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { AddSalesBudgetItemModalComponent } from '../add-sales-budget-item-modal/add-sales-budget-item-modal.component';

@Component({
  selector: 'app-add-sales-budget-header-modal',
  templateUrl: './add-sales-budget-header-modal.component.html',
  styleUrls: ['./add-sales-budget-header-modal.component.css']
})
export class AddSalesBudgetHeaderModalComponent {
  @ViewChild('addSalesBudgetHeaderModal', {static: true}) addSalesBudgetHeaderModal!: PoModalComponent;
  @ViewChild('addSalesBudgetItemModal', {static: true}) addSalesBudgetItemModal!: AddSalesBudgetItemModalComponent;
  @ViewChild('addSalesBudgetHeaderForm', {static: true}) addSalesBudgetHeaderForm!: PoDynamicFormComponent;

  readonly tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.removeItem.bind(this)
    }
  ];

  readonly tableHeight = window.innerHeight / 2.2;
  protected salesBudgetFields: PoDynamicFormField[] = [];
  protected salesBudgetValue: any = {};
  protected salesBudgetsItemsColumns: PoTableColumn[] = [];
  protected salesBudgetsItems: any[] = [];

  constructor(
    private salesRequestsService: SalesRequestsService,
    private poNotification: PoNotificationService
  ){
    this.salesBudgetFields = salesRequestsService.GetSalesRequestsHeaderFields();
    this.salesBudgetsItemsColumns = salesRequestsService.GetSalesRequestsItemsColumns();
  }

  public open(){
    this.addSalesBudgetHeaderModal.open();
  }

  protected openItemAddModal(): void {
    const nextItemNumber = this.getNextItemNumber();
    this.addSalesBudgetItemModal.open(nextItemNumber);
  }

  private getNextItemNumber(): string {
    if (this.salesBudgetsItems.length === 0) {
      return '001';
    }
  
    const maxItem = Math.max(
      ...this.salesBudgetsItems.map(item => parseInt(item['C6_ITEM'], 10) || 0)
    );
  
    const nextItem = (maxItem + 1).toString().padStart(3, '0');
    return nextItem;
  }

  public onSalesBudgetItemCreated(item: any): void {
    this.salesBudgetsItems = [...this.salesBudgetsItems, item];
  }

  private removeItem(itemToRemove: any): void {
    this.salesBudgetsItems = this.salesBudgetsItems.filter(item => item !== itemToRemove);
    this.renumberItems();
  }
  
  private renumberItems(): void {
    this.salesBudgetsItems = this.salesBudgetsItems.map((item, index) => ({
      ...item,
      C6_ITEM: (index + 1).toString().padStart(3, '0')
    }));
  }

  protected isCreateButtonDisabled(): boolean {
    return !this.addSalesBudgetHeaderForm || this.addSalesBudgetHeaderForm.form.invalid || this.salesBudgetsItems.length === 0;
  }

  protected async createSalesRequest(): Promise<void> {
    const requestPayload = this.buildSalesRequestPayload();

    try {
      const response = await this.salesRequestsService.PostSalesRequest(requestPayload);

      if (response?.codigo === 201) {
        this.addSalesBudgetHeaderModal.close();
        this.poNotification.success('Registro Criado Com Sucesso');
      } else {
        this.poNotification.error(response?.mensagem || 'Erro ao criar pedido');
      }
    } catch (error) {
      this.poNotification.error('Erro na requisição. Tente novamente mais tarde.');
    }
  }

  private buildSalesRequestPayload(): any {
    const payload = { ...this.salesBudgetValue };

    if (payload['C5_EMISSAO']) {
      payload['C5_EMISSAO'] = this.formatDateToYYYYMMDD(payload['C5_EMISSAO']);
    }

    payload['C5_LOJACLI'] = '01';
    payload['ITENS'] = this.salesBudgetsItems;

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
