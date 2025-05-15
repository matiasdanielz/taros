import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField } from '@po-ui/ng-components';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';

@Component({
  selector: 'app-add-sales-budget-item-modal',
  templateUrl: './add-sales-budget-item-modal.component.html',
  styleUrls: ['./add-sales-budget-item-modal.component.css']
})
export class AddSalesBudgetItemModalComponent {
  @ViewChild('addSalesBudgetItemModal', {static: true}) addSalesBudgetItemModal!: PoModalComponent;

  @Output() itemCreated = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado

  //Cadastro
  protected salesBudgetsFields: PoDynamicFormField[] = [];
  protected salesBudgetValue: any = {};

  constructor(
    private salesBudgetsService: SalesBudgetsService
  ){
    this.salesBudgetsFields = salesBudgetsService.GetSalesBudgetsItemsFields();
  }

  public open(item: string){
    this.salesBudgetValue['C6_ITEM'] = item;
    this.salesBudgetValue['CK_ITEM'] = item;
    this.salesBudgetValue['CK_OPER'] = "01";

    this.addSalesBudgetItemModal.open();
  }

  public OnCreateSalesBudgetItem() {

    this.salesBudgetValue['C6_PRODUTO'] = this.salesBudgetValue['CK_PRODUTO'];
    this.salesBudgetValue['C6_QTDVEN'] = this.salesBudgetValue['CK_QTDVEN'];

    // Emite o item criado para o componente pai
    this.itemCreated.emit(this.salesBudgetValue);

    // Fecha o modal, se quiser
    this.addSalesBudgetItemModal.close();

    // Limpa o formulário, se necessário
    this.salesBudgetValue = {};
  }
}
