import { Component, ViewChild } from '@angular/core';
import { PoDynamicFormField, PoModalComponent } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';

@Component({
  selector: 'app-edit-sales-request-modal',
  templateUrl: './edit-sales-request-modal.component.html',
  styleUrls: ['./edit-sales-request-modal.component.css']
})
export class EditSalesRequestModalComponent {
  @ViewChild('editSalesRequestModal', {static: true}) editSalesRequestModal!: PoModalComponent;

  //Cadastro
  protected salesRequestsFields: PoDynamicFormField[] = [];
  protected salesRequestInEdit: any = {};

  constructor(
    private salesRequestService: SalesRequestsService
  ){
    this.salesRequestsFields = salesRequestService.GetSalesRequestsHeaderFields();
  }

  public open(){
    this.editSalesRequestModal.open();
  }
}
