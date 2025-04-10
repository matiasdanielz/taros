import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoModalComponent, PoTableAction } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

@Component({
  selector: 'app-add-sales-request-item-modal',
  templateUrl: './add-sales-request-item-modal.component.html',
  styleUrls: ['./add-sales-request-item-modal.component.css']
})
export class AddSalesRequestItemModalComponent {
  @ViewChild('addSalesRequestItemModal', {static: true}) addSalesRequestItemModal!: PoModalComponent;

  @Output() itemCreated = new EventEmitter<any>(); // <<< Aqui emitimos quando o item for criado

  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'po-icon-edit',
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
    }
  ];

  //Cadastro
  protected salesRequestsFields: PoDynamicFormField[] = [];
  protected salesRequestValue: any = {};

  constructor(
    private salesRequestsService: SalesRequestsService
  ){
    this.salesRequestsFields = salesRequestsService.GetSalesRequestsItemsFields();
  }

  public open(item: string){
    this.salesRequestValue['C6_ITEM'] = item;

    this.addSalesRequestItemModal.open();
  }

  public OnCreateSalesRequestItem() {
    // Aqui você pode processar ou validar os dados

    // Emite o item criado para o componente pai
    this.itemCreated.emit(this.salesRequestValue);

    // Fecha o modal, se quiser
    this.addSalesRequestItemModal.close();

    // Limpa o formulário, se necessário
    this.salesRequestValue = {};
  }
}
