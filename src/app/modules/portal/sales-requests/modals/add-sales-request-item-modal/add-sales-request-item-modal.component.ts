import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation, PoModalComponent, PoTableAction } from '@po-ui/ng-components';
import { ProductsService } from 'src/app/services/products/products.service';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

@Component({
  selector: 'app-add-sales-request-item-modal',
  templateUrl: './add-sales-request-item-modal.component.html',
  styleUrls: ['./add-sales-request-item-modal.component.css']
})
export class AddSalesRequestItemModalComponent {
  @ViewChild('addSalesRequestItemModal', {static: true}) addSalesRequestItemModal!: PoModalComponent;

  @Output() itemCreated = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado

  //Cadastro
  protected salesRequestsFields: PoDynamicFormField[] = [];
  protected salesRequestValue: any = {};

  constructor(
    private salesRequestsService: SalesRequestsService,
    private productsService: ProductsService
  ){
  }

  public open(item: string, customerId: string){
    this.salesRequestValue['C6_ITEM'] = item;
    this.salesRequestValue['customerId'] = customerId;

    this.salesRequestsFields = this.salesRequestsService.GetSalesRequestsItemsFields(this.salesRequestValue['customerId']);


    this.addSalesRequestItemModal.open();
  }

  public onCreateSalesRequestItem() {
    // Emite o item criado para o componente pai
    this.itemCreated.emit(this.salesRequestValue);

    // Fecha o modal, se quiser
    this.addSalesRequestItemModal.close();

    // Limpa o formulário, se necessário
    this.salesRequestValue = {};
  }

  protected async onChangeFields(changedValue: PoDynamicFormFieldChanged): Promise<PoDynamicFormValidation>{
    if(changedValue['property'] == "C6_PRODUTO"){
      const response = await this.productsService.getProductsItems(changedValue['value']['C6_PRODUTO']);
      const selectedProduct = response[0];

      this.salesRequestValue['B1_DESC'] = selectedProduct['label'];
    }

    return {};
  }

}
