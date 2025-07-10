import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation, PoModalComponent } from '@po-ui/ng-components';
import { ProductsService } from 'src/app/services/products/products.service';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

@Component({
  selector: 'app-sales-request-item-modal',
  templateUrl: './sales-request-item-modal.component.html',
  styleUrls: ['./sales-request-item-modal.component.css']
})
export class SalesRequestItemModalComponent {
  @ViewChild('salesRequestItemModal', { static: true }) salesRequestItemModal!: PoModalComponent;

  @Output() itemCreated = new EventEmitter<any>();
  @Output() itemEdited = new EventEmitter<any>();

  salesRequestsFields: PoDynamicFormField[] = [];
  salesRequestValue: any = {};
  isEditMode = false;

  constructor(
    private salesRequestsService: SalesRequestsService,
    private productsService: ProductsService
  ) {}

  /**
   * Abre o modal em modo criar (novo item).
   * @param customerId Id do cliente para carregar campos dinâmicos.
   */
  openCreate(customerId: string, nextItemNumber: string): void {
    this.isEditMode = false;
    this.salesRequestValue = {
      customerId,
      C6_ITEM: nextItemNumber // Atribui o número sequencial
    };
    this.loadFields();
    this.salesRequestItemModal.open();
  }
  

  /**
   * Abre o modal em modo editar, preenchendo os dados do item.
   * @param itemToEdit Item a ser editado.
   */
  openEdit(itemToEdit: any) {
    this.isEditMode = true;
    this.salesRequestValue = { ...itemToEdit }; // copia para evitar referência direta
    this.loadFields();
    this.salesRequestItemModal.open();
  }

  private loadFields() {
    const customerId = this.salesRequestValue.customerId;
    this.salesRequestsFields = this.salesRequestsService.GetSalesRequestsItemsFields(customerId);
  }

  close() {
    this.salesRequestItemModal.close();
    this.salesRequestValue = {};
  }

  async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation> {
    if (changedValue.property === 'C6_PRODUTO') {
      const response = await this.productsService.getProductsItems(changedValue.value['C6_PRODUTO']);
      const selectedProduct = response[0];
      this.salesRequestValue['B1_DESC'] = selectedProduct ? selectedProduct.label : '';
    }
    return {};
  }

  onConfirm() {
    if (this.isEditMode) {
      this.itemEdited.emit(this.salesRequestValue);
    } else {
      this.itemCreated.emit(this.salesRequestValue);
    }
    this.close();
  }
}
