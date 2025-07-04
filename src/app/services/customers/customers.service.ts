import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoLookupFilteredItemsParams, PoTableColumn } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Customer } from 'src/app/models/customer/customer';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
  
    if (!salesmanId) {
      throw new Error('Sessão expirada ou inválida. Não é possível buscar clientes.');
    }
  
    const url: string = `${environment.apiDomain}/customers`;
  
    const { filterParams = {}, advancedFilters = {}, ...restFilteredItemsParams } = filteredParams;
    const params = {
      salesmanId,
      ...restFilteredItemsParams,
      ...filterParams,
      ...advancedFilters
    };
  
    return this.http.get(url, { params, ...environment.header });
  }
  

  getObjectByValue(value: string, filterParams: any) {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;    const url: string = `${environment.apiDomain}/customers`;
    const filters = {
      "value": value
    }

    return this.http
      .get(`${url}?filter=${value}&salesmanId=${salesmanId}`)
      .pipe(map((response: any) => response['items'][0]));
  }

  public GetCustomerColumns(): PoTableColumn[] {
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

  public GetCustomerFields(): PoDynamicViewField[] {
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


  public async GetCustomersItems(
    filter?: string,
    initialDate?: string,
    endDate?: string
  ): Promise<Customer[]> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
  
    if (!salesmanId) {
      console.warn('Usuário não está logado ou sessão inválida.');
      return [];
    }
  
    // Montagem segura da URL com parâmetros
    const params = new URLSearchParams();
    params.set('salesmanId', salesmanId);
    if (initialDate) params.set('initialDate', initialDate);
    if (endDate) params.set('endDate', endDate);
    if (filter) params.set('filter', filter);
  
    const url = `${environment.apiDomain}/customers?${params.toString()}`;
  
    const response: any = await this.http.get(url, environment.header).toPromise();
  
    return response?.items ?? [];
  }
  
}
