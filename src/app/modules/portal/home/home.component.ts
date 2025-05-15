import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { CustomersService } from '../customers/customers.service';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  protected cardHeight: number = window.innerHeight / 1.4;
  protected tableHeight: number = window.innerHeight / 2;

  protected filter: string = "";
  protected customersItems: any[] = [];
  protected customersColumns: PoTableColumn[] = [];

  protected salesRequestsItems: any[] = [];
  protected salesRequestsColumns: PoTableColumn[] = [];

  constructor(
    private customersService: CustomersService,
    private salesRequestsService: SalesRequestsService,
    private homeService: HomeService
  ){
    this.customersColumns = homeService.getCustomersColumns();
    this.salesRequestsColumns = homeService.getSalesRequestsColumns();
  }

  async ngOnInit(): Promise<void> {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('pt-BR');
    const todayFormatted = today.toLocaleDateString('pt-BR');

    this.customersItems = await this.customersService.GetCustomersItems(this.filter, firstDayOfCurrentMonth, todayFormatted);
    this.salesRequestsItems = await this.salesRequestsService.GetSalesRequestsItems(this.filter);
  }
}
