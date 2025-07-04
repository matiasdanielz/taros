import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField } from '@po-ui/ng-components';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';

@Component({
  selector: 'app-edit-sales-budget-item-modal',
  templateUrl: './edit-sales-budget-item-modal.component.html',
  styleUrls: ['./edit-sales-budget-item-modal.component.css']
})
export class EditSalesBudgetItemModalComponent {
  @ViewChild('editSalesBudgetModal', {static: true}) editSalesBudgetModal!: PoModalComponent;

  @Output() itemEdited = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado

  //Cadastro
  protected salesBudgetsFields: PoDynamicFormField[] = [];
  protected salesBudgetValue: any = {};

  constructor(
    private salesBudgetsService: SalesBudgetsService
  ){
  }

  public open(itemToEdit: any, customerId: string){
    this.salesBudgetValue = itemToEdit;
    this.salesBudgetValue['CJ_CLIENTE'] = customerId;

    this.salesBudgetsFields = this.salesBudgetsService.GetSalesBudgetsItemsFields(this.salesBudgetValue['CJ_CLIENTE']);


    this.editSalesBudgetModal.open();
  }

  public OnEditSalesBudgetItem() {
    // Aqui você pode processar ou validar os dados

    // Emite o item criado para o componente pai
    this.itemEdited.emit(this.salesBudgetValue);

    // Fecha o modal, se quiser
    this.editSalesBudgetModal.close();

    // Limpa o formulário, se necessário
    this.salesBudgetValue = {};
  }
}
