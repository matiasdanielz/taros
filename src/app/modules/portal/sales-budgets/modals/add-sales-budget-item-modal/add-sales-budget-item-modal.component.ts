import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation } from '@po-ui/ng-components';
import { ProductsService } from 'src/app/services/products/products.service';
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
    private salesBudgetsService: SalesBudgetsService,
    private productsService: ProductsService
  ){
  }

  public open(item: string, customerId: string){
    this.salesBudgetValue['C6_ITEM'] = item;
    this.salesBudgetValue['CK_ITEM'] = item;
    this.salesBudgetValue['CK_OPER'] = "01";
    this.salesBudgetValue['CJ_CLIENTE'] = customerId;

    this.salesBudgetsFields = this.salesBudgetsService.GetSalesBudgetsItemsFields(this.salesBudgetValue['CJ_CLIENTE']);

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

    protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation>{
      if(changedValue['property'] == "CK_PRODUTO"){
        const response = await this.productsService.getProductsItems(changedValue['value']['CK_PRODUTO']);
        const selectedProduct = response[0];
  
        this.salesBudgetValue['B1_DESC'] = selectedProduct['label'];
      }
  
      return {};
    }
}
