import { Component, OnInit } from '@angular/core';
import { CustomersService } from './customers.service';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  //Parametros Da Tabela
  protected tableHeight: number = window.innerHeight / 1.5;
  protected tableActions: PoTableAction[] = [
    {
      label: 'Ver Mais',
      icon: 'po-icon-eye'
    },
  ];

  //Itens Da Tabela De Clientes
  protected customersColumns: PoTableColumn[] = [];
  protected customersItems: any[] = [];
  protected page: number = 0;
  protected pageSize: number = 12;
  protected filter: string = '';

  constructor(
    private customersService: CustomersService
  ){
    this.customersColumns = customersService.GetCustomerColumns();
  }

  async ngOnInit(): Promise<void> {
    await this.LoadCustomers();
  }

  protected async LoadCustomers(){
    this.customersItems = await this.customersService.GetCustomersItems(this.filter);
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
