import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

@Component({
  selector: 'app-edit-sales-request-item-modal',
  templateUrl: './edit-sales-request-item-modal.component.html',
  styleUrls: ['./edit-sales-request-item-modal.component.css']
})
export class EditSalesRequestItemModalComponent {
  @ViewChild('editSalesRequestModal', {static: true}) editSalesRequestModal!: PoModalComponent;

  @Output() itemEdited = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado

  //Cadastro
  protected salesRequestsFields: PoDynamicFormField[] = [];
  protected salesRequestValue: any = {};

  constructor(
    private salesRequestService: SalesRequestsService
  ){
    this.salesRequestsFields = salesRequestService.GetSalesRequestsItemsFields();
  }

  public open(itemToEdit: any){
    this.salesRequestValue = itemToEdit;
    this.editSalesRequestModal.open();

    console.log(this.salesRequestValue);
  }

  public OnEditSalesRequestItem() {
    // Aqui você pode processar ou validar os dados

    // Emite o item criado para o componente pai
    this.itemEdited.emit(this.salesRequestValue);

    // Fecha o modal, se quiser
    this.editSalesRequestModal.close();

    // Limpa o formulário, se necessário
    this.salesRequestValue = {};
  }
}
