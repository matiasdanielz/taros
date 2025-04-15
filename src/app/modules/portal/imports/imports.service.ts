import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  constructor(
    private http: HttpClient
  ) { }

  public GetImportsColumns(): PoTableColumn[]{
    return [
      {
        property: 'salesOrder',
        label: 'Pedido de Venda',
        width: '150px'
      },
      {
        property: 'date',
        label: 'Data',
        type: 'date',
        width: '150px'
      },
      {
        property: 'status',
        label: 'Status',
        type: 'label',
        width: '150px',
        labels: [
          {
            value: 'I',
            label: 'Integrado',
            color: 'color-04'
          },
          {
            value: 'E',
            label: 'Erro',
            color: 'color-08'
          },
        ]
      },
      {
        property: 'cnpj',
        label: 'CNPJ',
        width: '150px'
      },
      {
        property: 'priceTable',
        label: 'Tabela de Preço',
        width: '150px'
      },
      {
        property: 'paymentCondition',
        label: 'Cond. Pagamento',
        width: '150px'
      },
      {
        property: 'discountPercent',
        label: '% Desconto',
        width: '120px'
      },
      {
        property: 'purchaseOrder',
        label: 'Pedido de Compra',
        width: '150px'
      },
      {
        property: 'issueDate',
        label: 'Data Emissão',
        type: 'date',
        width: '130px'
      },
      {
        property: 'fileName',
        label: 'Arquivo',
        width: '200px'
      },      
    ];
  }

    public async GetImportsItems(): Promise<any[]>{    
      const url: string = `${environment.apiDomain}/imports?`;
  
      const response: any = await this.http.get(url, environment.header).toPromise();
      
      return response['items'];
    } 
}
