import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }
  
  public GetCustomerColumns(): PoTableColumn[]{
    return [
      {
        property: 'id',
        label: 'Código',
        width: '100px'
      },
      {
        property: 'store',
        label: 'Loja',
      },
      {
        property: 'status',
        label: 'Status',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: '1',
            label: 'Inativo',
            color: 'color-07'
          },
          {
            value: '2',
            label: 'Ativo',
            color: 'color-10'
          }
        ]
      },
      {
        property: 'name',
        label: 'Nome',
        width: '200px'
      },
      {
        property: 'fantasyName',
        label: 'Nome Reduzido',
        width: '200px'
      },
      {
        property: 'type',
        label: 'Tipo de Cliente',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: 'L',
            label: 'Prod. Rural',
            color: 'color-01'
          },
          {
            value: 'F',
            label: 'Cons. Final',
            color: 'color-03'
          },
          {
            value: 'R',
            label: 'Revendedor',
            color: 'color-05'
          },
          {
            value: 'S',
            label: 'ICMS Solid.',
            color: 'color-07'
          },
          {
            value: 'X',
            label: 'Exportação',
            color: 'color-09'
          },
        ]
      },
      {
        property: 'person',
        label: 'Pessoa (F/J)',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: 'J',
            label: 'Juridica',
            color: 'color-08'
          },
          {
            value: 'F',
            label: 'Fisica',
            color: 'color-10'
          }
        ]
      },
      {
        property: 'brazilianTaxId',
        label: 'CNPJ/CPF',
        width: '150px'
      },
      {
        property: 'stateInscription',
        label: 'Inscrição Estadual',
        width: '200px'
      },
      {
        property: 'adress',
        label: 'Endereço',
        width: '200px'
      },
      {
        property: 'neighborhood',
        label: 'Bairro',
        width: '200px'
      },
      {
        property: 'city',
        label: 'Cidade',
        width: '200px'
      },
      {
        property: 'state',
        label: 'Estado',
        width: '200px'
      },
      {
        property: 'zip',
        label: 'CEP',
        width: '200px'
      },
      {
        property: 'phone',
        label: 'Telefone',
        width: '200px'
      },
      {
        property: 'email',
        label: 'E-mail',
        width: '200px'
      },
      {
        property: 'paymentCondition',
        label: 'Cond. Pagamento',
        width: '200px'
      },
      {
        property: 'priceTable',
        label: 'Tabela de Preço',
        width: '200px'
      }    
    ];
  }

  public GetCustomerFields(): PoDynamicViewField[]{
    return [
      {
        property: 'id',
        label: 'Código',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'store',
        label: 'Loja',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'status',
        label: 'Status',
        gridColumns: 4,
        gridSmColumns: 12,
        type: 'label',
        tag: true
      },
      {
        property: 'name',
        label: 'Nome',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'fantasyName',
        label: 'Nome Reduzido',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'type',
        label: 'Tipo de Cliente',
        gridColumns: 4,
        gridSmColumns: 12,
        tag: true
      },
      {
        property: 'person',
        label: 'Pessoa (F/J)',
        gridColumns: 4,
        gridSmColumns: 12,
        tag: true
      },
      {
        property: 'brazilianTaxId',
        label: 'CNPJ/CPF',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'stateInscription',
        label: 'Inscrição Estadual',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'adress',
        label: 'Endereço',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'neighborhood',
        label: 'Bairro',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'city',
        label: 'Cidade',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'state',
        label: 'Estado',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'zip',
        label: 'CEP',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'phone',
        label: 'Telefone',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'email',
        label: 'E-mail',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'paymentCondition',
        label: 'Cond. Pagamento',
        gridColumns: 4,
        gridSmColumns: 12
      },
      {
        property: 'priceTable',
        label: 'Tabela de Preço',
        gridColumns: 4,
        gridSmColumns: 12
      }
    ];
    
  }


  public async GetCustomersItems(filter?: string, initialDate?: string, endDate?: string): Promise<any[]>{ 
    const salesmanId = localStorage.getItem('salesmanId');
    const url: string = `${environment.apiDomain}/customers?`+
      `&salesmanId=${salesmanId}` + 
      `&initialDate=${initialDate}` + 
      `&endDate=${endDate}` + 
      `&filter=${filter}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }
}
