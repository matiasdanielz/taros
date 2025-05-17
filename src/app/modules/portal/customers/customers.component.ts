import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomersService } from './customers.service';
import { PoDynamicViewField, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild('customerInfoModal', {static: true}) customerInfoModal!: PoModalComponent;

  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.2;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'po-icon-eye',
      action: this.openCustomerInfoModal.bind(this)
    },
  ];

  //Itens Da Tabela De Clientes
  protected customersColumns: PoTableColumn[] = [];
  protected customersItems: any[] = [];
  protected customersFields: PoDynamicViewField[] = [];
  protected currentCustomerInView: any;
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private customersService: CustomersService
  ){
    this.customersColumns = customersService.GetCustomerColumns();
    this.customersFields = customersService.GetCustomerFields();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadCustomers();
  }

  protected async LoadCustomers(){
    this.customersItems = await this.customersService.GetCustomersItems(this.filter, '', '');
  }

  protected openCustomerInfoModal(selectedItem: any){
    this.currentCustomerInView = selectedItem;
    this.customerInfoModal.open();
  }

  protected onSearch(filter: string): any {
    this.page = -1;
    this.customersItems = [];
    this.filter = filter
    this.LoadCustomers()
  }

  protected onResetSearch(): any {
    this.page = -1;
    this.customersItems = [];
    this.filter = ''
    this.LoadCustomers()
  }
}
