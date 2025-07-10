import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation } from '@po-ui/ng-components';
import { ProductsService } from 'src/app/services/products/products.service';
import { SalesBudgetsService } from 'src/app/services/salesBudgets/sales-budgets.service';

@Component({
  selector: 'app-sales-budget-item-modal',
  templateUrl: './sales-budget-item-modal.component.html',
  styleUrls: ['./sales-budget-item-modal.component.css']
})
export class SalesBudgetItemModalComponent {
  @ViewChild('salesBudgetItemModal', { static: true }) salesBudgetItemModal!: PoModalComponent;

  @Output() itemCreated = new EventEmitter<any>();
  @Output() itemEdited = new EventEmitter<any>();

  salesBudgetsFields: PoDynamicFormField[] = [];
  salesBudgetValue: any = {};

  isEditMode: boolean = false;

  constructor(
    private salesBudgetsService: SalesBudgetsService,
    private productsService: ProductsService
  ) {}

  // Abre modal em modo criação
  openAdd(item: string, customerId: string) {
    this.isEditMode = false;

    this.salesBudgetValue = {
      C6_ITEM: item,
      CK_ITEM: item,
      CK_OPER: '01',
      CJ_CLIENTE: customerId
    };

    this.salesBudgetsFields = this.salesBudgetsService.GetSalesBudgetsItemsFields(customerId);

    this.salesBudgetItemModal.open();
  }

  // Abre modal em modo edição
  openEdit(itemToEdit: any, customerId: string) {
    this.isEditMode = true;

    this.salesBudgetValue = { ...itemToEdit };
    this.salesBudgetValue.CJ_CLIENTE = customerId;

    this.salesBudgetsFields = this.salesBudgetsService.GetSalesBudgetsItemsFields(customerId);

    this.salesBudgetItemModal.open();
  }

  // Fecha o modal
  close() {
    this.salesBudgetItemModal.close();
    this.salesBudgetValue = {};
  }

  // Confirmar ação conforme o modo
  confirm() {
    if (this.isEditMode) {
      this.OnEditSalesBudgetItem();
    } else {
      this.OnCreateSalesBudgetItem();
    }
  }

  // Criar item
  private OnCreateSalesBudgetItem() {
    this.salesBudgetValue.C6_PRODUTO = this.salesBudgetValue.CK_PRODUTO;
    this.salesBudgetValue.C6_QTDVEN = this.salesBudgetValue.CK_QTDVEN;

    this.itemCreated.emit(this.salesBudgetValue);

    this.close();
  }

  // Editar item
  private OnEditSalesBudgetItem() {
    this.itemEdited.emit(this.salesBudgetValue);

    this.close();
  }

  // Validação dinâmica (exemplo: quando altera produto)
  protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changedValue.property === 'CK_PRODUTO') {
      const response = await this.productsService.getProductsItems(changedValue.value['CK_PRODUTO']);
      const selectedProduct = response[0];

      this.salesBudgetValue.B1_DESC = selectedProduct?.label || '';
    }
    return {};
  }
}
