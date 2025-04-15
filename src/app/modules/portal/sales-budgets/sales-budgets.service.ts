import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesBudgetsService {

  constructor(
    private http: HttpClient
  ) { }

  public GetSalesBudgetsColumns(): PoTableColumn[]{
    return [
      {
        property: 'status',
        label: 'Status',
        type: 'label',
        labels: [
          {
            value: 'S',
            label: 'Sa'
          }
        ],
        width: '150px'
      },
      {
        property: 'orderNumber',
        label: 'Pedido',
        width: "100px"
      },
      {
        property: "customerCode",
        label: "Código do Cliente",
        width: "150px"
      },
      {
        property: "store",
        label: "Loja",
        width: "75px"
      },
      {
        property: "customerName",
        label: "Nome do Cliente",
        width: "250px"
      },
      {
        property: "issueDate",
        label: "Data de Emissão",
        type: 'date',
        width: "150px"
      },
      {
        property: "discount",
        label: "Desconto",
        width: "150px"
      },
      {
        property: "priceTable",
        label: "Tabela De Preço",
        width: "150px"
      },
      {
        property: "carrier",
        label: "Transportadora",
        width: "150px"
      },
      {
        property: "paymentCondition",
        label: "Condição de Pagamento",
        width: "200px"
      },
      {
        property: 'shippingMethod',
        label: 'Tipo De Frete',
        width: '150px'
      }
    ];
  }

  public async GetSalesBudgetsItems(): Promise<any[]>{    
    const url: string = `${environment.apiDomain}/salesBudgets?`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  } 
}
