import { Component, OnInit, ViewChild } from '@angular/core';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { SalesBudgetsService } from './sales-budgets.service';

@Component({
  selector: 'app-sales-budgets',
  templateUrl: './sales-budgets.component.html',
  styleUrls: ['./sales-budgets.component.css']
})
export class SalesBudgetsComponent implements OnInit{
  @ViewChild('addSalesBudgetHeaderModal', {static: true}) addSalesBudgetHeaderModal: any;

  //Parametros da pagina
  protected pageActions: PoTableAction[] = [
    {
      label: 'Adicionar',
      action: () => this.addSalesBudgetHeaderModal.open()
    },
  ];

  protected tableHeight: number = window.innerHeight / 1.5;
  protected salesBudgetsColumns: PoTableColumn[] = [];
  protected salesBudgetsItems: any[] = [];

  constructor(
    private salesBudgetService: SalesBudgetsService
  ){
    this.salesBudgetsColumns = salesBudgetService.GetSalesBudgetsColumns();
  }
  async ngOnInit(): Promise<void> {
    this.salesBudgetsItems = await this.salesBudgetService.GetSalesBudgetsItems();
  }
}
