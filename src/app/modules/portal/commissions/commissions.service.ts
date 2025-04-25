import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { last } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  public GetCommissionsHeaderFields(): PoDynamicViewField[]{
    return [
      {
        property: 'year',
        label: 'Ano',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'monthLabel',
        label: 'Mês',
        gridColumns: 6,
        gridSmColumns: 12
      },
    ];
  }

  public GetCommissionsHeaderColumns(): PoTableColumn[]{
    return [
      {
        property: 'year',
        label: 'Ano'
      },
      {
        property: 'monthLabel',
        label: 'Mês (Descrição)'
      },
      {
        property: 'commissionsAmount',
        label: 'Qtde Comissões'
      },
      {
        property: 'salesBase',
        label: 'Base de Vendas',
        type: 'currency',
        format: "R$"
      },
      {
        property: 'commissionValue',
        label: 'Valor Comissão',
        type: 'currency',
        format: "R$"
      }
    ];    
  }

  public GetCommissionsItemsColumns(): PoTableColumn[]{
    return [
      {
        property: 'branch',
        label: 'Filial',
        width: '125px'
      },
      {
        property: 'id',
        label: 'Id Venda',
        width: '125px'
      },
      {
        property: 'serial',
        label: 'Serie',
        width: '125px'
      },
      {
        property: 'parcel',
        label: 'Parcela',
        width: '125px'
      },
      {
        property: 'emissionDate',
        label: 'Dta Emissão',
        type: 'date',
        width: '125px'
      },
      {
        property: 'customer',
        label: 'Cliente',
        width: '125px'
      },
      {
        property: 'salesBase',
        label: 'Vendas',
        width: '125px'
      },
      {
        property: 'commissionValue',
        label: 'Comissão',
        width: '125px'
      },
      {
        property: 'salesBase',
        label: 'Base Comissão',
        width: '125px'
      },
      {
        property: 'percentage',
        label: '% Comissão',
        width: '125px'
      },
      {
        property: 'type',
        label: 'Tipo',
        width: '125px'
      },
      {
        property: 'store',
        label: 'Loja',
        width: '125px'
      },
      {
        property: 'issueClearance',
        label: 'Dta Liberação',
        type: 'date',
        width: '125px'
      },
      {
        property: 'order',
        label: 'Pedido',
        width: '125px'
      },
      {
        property: 'dueDate',
        label: 'Vencimento',
        type: 'date',
        width: '125px'
      }
    ];
    
  }

  public async GetCommissionsItems(): Promise<any[]>{
    const salesmanId = this.cookieService.get('salesmanId');
    const url: string = `${environment.apiDomain}/commissions?salesmanId=${salesmanId}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }
}
