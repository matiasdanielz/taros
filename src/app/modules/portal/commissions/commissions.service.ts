import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { last } from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  constructor(
    private http: HttpClient
  ) { }

  public GetCommissionsColumns(): PoTableColumn[]{
    const details: PoTableDetail = {
      typeHeader: 'top',
      columns: [
        {
          property: 'branch',
          label: 'Filial'
        },
        {
          property: 'id',
          label: 'Id Venda'
        },
        {
          property: 'serial',
          label: 'Serie'
        },
        {
          property: 'parcel',
          label: 'Parcela'
        },
        {
          property: 'emissionDate',
          label: 'Dta Emissão'
        },
        {
          property: 'customer',
          label: 'Cliente'
        },
        {
          property: 'sales',
          label: 'Vendas'
        },
        {
          property: 'commissionValue',
          label: 'Comissão'
        }
      ]
    }

    return [
      {
        property: 'branch',
        label: 'Filial'
      },
      {
        property: 'id',
        label: 'Id Venda'
      },
      {
        property: 'emissionDate',
        label: 'Dta Emissão',
        type: 'date'
      },
      {
        property: 'serial',
        label: 'Serie'
      },
      {
        property: 'customer',
        label: 'Cliete'
      },
      {
        property: 'sales',
        label: 'Vendas'
      },
      {
        property: 'commissionValue',
        label: 'Comissão'
      }
    ];
  }

  public async GetCommissionsItems(): Promise<any[]>{
    const url: string = `${environment.apiDomain}/commissions?`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }
}
