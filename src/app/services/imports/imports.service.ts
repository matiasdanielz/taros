import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Import } from 'src/app/models/import/import';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public GetImportsFields(): PoDynamicViewField[] {
    return [
      {
        property: 'salesOrder',
        label: 'Pedido de Venda',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'date',
        label: 'Data',
        type: 'date',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'status',
        label: 'Status',
        gridColumns: 6,
        gridSmColumns: 12,
        tag: true
      },
      {
        property: 'cnpj',
        label: 'CNPJ',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'priceTable',
        label: 'Tabela de Preço',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'paymentCondition',
        label: 'Cond. Pagamento',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'discountPercent',
        label: '% Desconto',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'purchaseOrder',
        label: 'Pedido de Compra',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'issueDate',
        label: 'Data Emissão',
        type: 'date',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'fileName',
        label: 'Arquivo',
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'observations',
        label: 'Observações',
        gridColumns: 12
      }
    ];
    
  }  

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
        property: 'fileName',
        label: 'Arquivo',
        width: '200px'
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
    ];
  }

  public async GetImportsItems(): Promise<Import[]> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
  
    if (!salesmanId) {
      console.warn('Usuário não está logado ou sessão inválida.');
      return [];
    }
  
    const url = `${environment.apiDomain}/imports?salesmanId=${salesmanId}`;
    const response: any = await this.http.get(url, environment.header).toPromise();
  
    return response?.items ?? [];
  }
  

  public async PostImportItem(importItem: any): Promise<any> {
    const url: string = `http://200.229.234.214:8091/rest/valclei/integracao`;
  
    try {
      const response: any = await this.http.post(url, importItem, environment.header).toPromise();
      return response;
    } catch (error: any) {
      console.error('Erro ao importar item:', error);
  
      // Retorna o corpo da resposta de erro, se disponível
      if (error.error) {
        return error.error;
      }
  
      // Caso não haja um corpo de erro, retorna o próprio erro
      return error;
    }
  }
  
  async parseCsvToGroupedJson(csv: string): Promise<any[]> {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(';');
  
    const headerMap: Record<string, string> = {
      CNPJ: 'CNPJ',
      PEDIDO_CLIENTE: 'pedidoCliente',
      TIPO_FRETE: 'C5_TPFRETE',
      MENSAGEM_NOTA: 'C5_MENNOTA',
      ITEM_DO_PEDIDO: 'itemPedido',
      PRODUTO: 'produto',
      QUANTIDADE: 'quantidade'
    };
  
    const pedidosMap = new Map<string, any>();
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';');
      const row: any = {};
      headers.forEach((header, index) => {
        const newKey = headerMap[header];
        if (newKey) {
          row[newKey] = values[index];
        }
      });
  
      const pedidoKey = row['pedidoCliente'];
  
      if (!pedidosMap.has(pedidoKey)) {
        pedidosMap.set(pedidoKey, {
          CNPJ: row['CNPJ'],
          C5_TPFRETE: row['C5_TPFRETE'],
          C5_MENNOTA: row['C5_MENNOTA'],
          ITENS: []
        });
      }
  
      const pedido = pedidosMap.get(pedidoKey);
      pedido.ITENS.push({
        C6_PEDCLI: row['pedidoCliente'],
        C6_ITEM: row['itemPedido'],
        C6_PRODUTO: row['produto'],
        C6_QTDVEN: row['quantidade'],
        C6_OPER: "01"
      });
    }
  
    return Array.from(pedidosMap.values());
  }

  private parseNumber(value: any): number {
    if (typeof value === 'object' && value?.result !== undefined) {
      return Number(value.result);
    }
    return Number(value);
  }
}
