import { Component } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { SalesBudgetsService } from './sales-budgets.service';

@Component({
  selector: 'app-sales-budgets',
  templateUrl: './sales-budgets.component.html',
  styleUrls: ['./sales-budgets.component.css']
})
export class SalesBudgetsComponent {

  protected tableHeight: number = window.innerHeight / 1.5;
  protected salesBudgetsColumns: PoTableColumn[] = [];
  protected salesBudgetsItems: any[] = [];

  constructor(
    private salesBudgetService: SalesBudgetsService
  ){
    this.salesBudgetsColumns = salesBudgetService.GetSalesBudgetsColumns();
    this.salesBudgetsItems = salesBudgetService.GetSalesBudgetsItems();
  }
}
