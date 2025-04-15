import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoModalComponent } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

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
    private salesRequestService: SalesRequestsService
  ){
    this.salesBudgetsFields = salesRequestService.GetSalesRequestsItemsFields();
  }

  public open(item: string){
    this.salesBudgetValue['C6_ITEM'] = item;

    this.addSalesBudgetItemModal.open();
  }

  public OnCreateSalesBudgetItem() {
    // Aqui você pode processar ou validar os dados

    // Emite o item criado para o componente pai
    this.itemCreated.emit(this.salesBudgetValue);

    // Fecha o modal, se quiser
    this.addSalesBudgetItemModal.close();

    // Limpa o formulário, se necessário
    this.salesBudgetValue = {};
  }
}
