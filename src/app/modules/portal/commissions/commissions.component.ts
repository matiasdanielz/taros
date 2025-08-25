import { Component, OnInit, ViewChild } from '@angular/core';
import { PoChartSerie, PoChartType, PoDynamicViewField, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Commission, CommissionItem } from 'src/app/models/commission/commission';
import { CommissionsService } from 'src/app/services/commissions/commissions.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit{
  @ViewChild('commissionDetailsModal', {static: true}) commissionDetailsModal!: PoModalComponent;

  protected tableActions: PoTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'po-icon-eye',
      action: this.openCommissionDetailsModal.bind(this)
    }
  ];

  // Charts
  protected commissionsType: PoChartType = PoChartType.Line;
  protected commissionsSeries: PoChartSerie[] = [];
  protected commissionsCategories: any[] = [];

  // Tabela
  protected tableHeight: number = window.innerHeight / 2;
  protected commissionsHeaderFields: PoDynamicViewField[] = [];
  protected currentCommissionHeaderInView: Commission = {};
  protected commissionsHeaderColumns: PoTableColumn[] = [];
  protected commissionsHeaderItems: Commission[] = [];

  protected commissionsItemsColumns: PoTableColumn[] = [];
  protected commissionsItems: CommissionItem[] = [];

  constructor(
    private commissionsService: CommissionsService
  ){
    this.commissionsHeaderColumns = this.commissionsService.GetCommissionsHeaderColumns();
    this.commissionsItemsColumns = this.commissionsService.GetCommissionsItemsColumns();
    this.commissionsHeaderFields = this.commissionsService.GetCommissionsHeaderFields();
  }

  async ngOnInit(): Promise<void> {
    this.commissionsHeaderItems = await this.commissionsService.GetCommissionsItems();
    this.setupChartData();
  }

  private setupChartData(): void {
    const last6Items = this.commissionsHeaderItems.slice(-6);

    this.commissionsCategories = last6Items.map(item => item.monthLabel);
    this.commissionsSeries = [
      {
        label: 'Vendas',
        data: last6Items.map(item => item.salesBase!),
        color: 'color-03'
      },
      {
        label: 'Comissão',
        data: last6Items.map(item => item.commissionValue!),
        color: 'color-08'
      }
    ];
  }

  protected openCommissionDetailsModal(selectedItem: any){
    this.commissionsItems = selectedItem['items'];
    this.currentCommissionHeaderInView = selectedItem;
    this.commissionDetailsModal.open();
  }
}
