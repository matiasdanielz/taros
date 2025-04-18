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
            label: 'Ativo',
            color: 'color-06'
          },
          {
            value: '2',
            label: 'Inativo',
            color: 'color-07'
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
        gridColumns: 6
      },
      {
        property: 'store',
        label: 'Loja',
        gridColumns: 6
      },
      {
        property: 'status',
        label: 'Status',
        gridColumns: 6,
        type: 'label',
        tag: true
      },
      {
        property: 'name',
        label: 'Nome',
        gridColumns: 6
      },
      {
        property: 'fantasyName',
        label: 'Nome Reduzido',
        gridColumns: 6,
      },
      {
        property: 'type',
        label: 'Tipo de Cliente',
        gridColumns: 6,
        tag: true
      },
      {
        property: 'person',
        label: 'Pessoa (F/J)',
        gridColumns: 6,
        tag: true
      },
      {
        property: 'brazilianTaxId',
        label: 'CNPJ/CPF',
        gridColumns: 6,
      },
      {
        property: 'stateInscription',
        label: 'Inscrição Estadual',
        gridColumns: 6,
      },
      {
        property: 'adress',
        label: 'Endereço',
        gridColumns: 6,
      },
      {
        property: 'neighborhood',
        label: 'Bairro',
        gridColumns: 6,
      },
      {
        property: 'city',
        label: 'Cidade',
        gridColumns: 6,
      },
      {
        property: 'state',
        label: 'Estado',
        gridColumns: 6,
      },
      {
        property: 'zip',
        label: 'CEP',
        gridColumns: 6,
      },
      {
        property: 'phone',
        label: 'Telefone',
        gridColumns: 6,
      },
      {
        property: 'email',
        label: 'E-mail',
        gridColumns: 6,
      },
      {
        property: 'paymentCondition',
        label: 'Cond. Pagamento',
        gridColumns: 6,
      },
      {
        property: 'priceTable',
        label: 'Tabela de Preço',
        gridColumns: 6,
      }    
    ];
  }


  public async GetCustomersItems(filter?: string): Promise<any[]>{ 
    const salesmanId = this.cookieService.get('salesmanId');
    
    const url: string = `${environment.apiDomain}/customers?`+
      `&salesmanId=${salesmanId}` + 
      `&filter=${filter}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }
}
