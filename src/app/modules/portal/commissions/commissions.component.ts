import { Component, OnInit } from '@angular/core';
import { PoChartSerie, PoChartType, PoTableColumn } from '@po-ui/ng-components';
import { CommissionsService } from './commissions.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit{

  // Charts
  protected commissionsType: PoChartType = PoChartType.Line;
  protected commissionsSeries: PoChartSerie[] = [];
  protected commissionsCategories: any[] = [];

  // Tabela
  protected tableHeight: number = window.innerHeight / 2;
  protected commissionsColumns: PoTableColumn[] = [];
  protected commissionsItems: any[] = [];

  constructor(private commissionsService: CommissionsService){
    this.commissionsColumns = this.commissionsService.GetCommissionsColumns();

    this.setupChartData();
  }

  async ngOnInit(): Promise<void> {
    this.commissionsItems = await this.commissionsService.GetCommissionsItems();
  }

  private setupChartData(): void {
    const last6Items = this.commissionsItems.slice(-6);

    const monthLabelMap: Record<string, string> = {
      january: 'Janeiro',
      february: 'Fevereiro',
      march: 'Março',
      april: 'Abril',
      may: 'Maio',
      june: 'Junho',
      july: 'Julho',
      august: 'Agosto',
      september: 'Setembro',
      october: 'Outubro',
      november: 'Novembro',
      december: 'Dezembro'
    };

    this.commissionsCategories = last6Items.map(item => monthLabelMap[item.month]);
    this.commissionsSeries = [
      {
        label: 'Vendas Brutas',
        data: last6Items.map(item => item.commissionValue)
      },
      {
        label: 'Vendas Liquidas',
        data: last6Items.map(item => item.commissionValue)
      },
      {
        label: 'Comissão',
        data: last6Items.map(item => item.commissionValue)
      }
    ];
  }
}
