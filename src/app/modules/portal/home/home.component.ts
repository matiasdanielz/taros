import { Component, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { SalesRequestsService } from 'src/app/services/salesRequests/sales-requests.service';
import { HomeService } from './home.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomersService } from 'src/app/services/customers/customers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected cardHeight: number = window.innerHeight / 1.4;
  protected tableHeight: number = window.innerHeight / 2;

  protected filter: string = '';
  protected customersItems: any[] = [];
  protected customersColumns: PoTableColumn[] = [];

  protected salesRequestsItems: any[] = [];
  protected salesRequestsColumns: PoTableColumn[] = [];

  protected userName: string = 'Usuário';

  constructor(
    private customersService: CustomersService,
    private salesRequestsService: SalesRequestsService,
    private homeService: HomeService,
    private authService: AuthService
  ) {
    this.customersColumns = homeService.getCustomersColumns();
    this.salesRequestsColumns = homeService.getSalesRequestsColumns();
  }

  async ngOnInit(): Promise<void> {
    const session = this.authService.getSession();
    this.userName = session?.sessionInfo?.name || 'Usuário';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}${month}${day}`;
    const firstDayOfCurrentMonth = `${year}${month}01`;

    this.customersItems = await this.customersService.GetCustomersItems(this.filter, firstDayOfCurrentMonth, todayFormatted);
    this.salesRequestsItems = await this.salesRequestsService.GetSalesRequestsItems(this.filter, firstDayOfCurrentMonth, todayFormatted);
  }
}
