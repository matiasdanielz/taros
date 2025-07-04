import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Commission } from 'src/app/models/commission/commission';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public GetCommissionsHeaderFields(): PoDynamicViewField[] {
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

  public GetCommissionsHeaderColumns(): PoTableColumn[] {
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

  public GetCommissionsItemsColumns(): PoTableColumn[] {
    return [
      {
        property: 'branch',
        label: 'Filial',
        width: '125px'
      },
      {
        property: 'invoice',
        label: 'Nota Fiscal',
        width: '125px'
      },
      {
        property: 'order',
        label: 'Pedido',
        width: '125px'
      },
      {
        property: 'serial',
        label: 'Serie NF',
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
        label: 'ID Cliente',
        width: '125px'
      },
      {
        property: 'customerName',
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
        property: 'dueDate',
        label: 'Vencimento',
        type: 'date',
        width: '125px'
      }
    ];

  }

  public async GetCommissionsItems(): Promise<Commission[]> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;

    if (!salesmanId) {
      console.warn('Usuário não está logado ou sessão inválida.');
      return [];
    }

    const url: string = `${environment.apiDomain}/commissions?salesmanId=${salesmanId}`;
    const response: any = await this.http.get(url, environment.header).toPromise();

    return response['items'] ?? [];
  }

}
