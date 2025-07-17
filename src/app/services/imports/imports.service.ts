import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Import } from 'src/app/models/import/import';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  private readonly importUrl = 'http://200.229.234.214:8091/rest/valclei/integracao';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public GetImportsFields(): PoDynamicViewField[] {
    return [
      { property: 'salesOrder', label: 'Pedido de Venda', gridColumns: 6, gridSmColumns: 12 },
      { property: 'date', label: 'Data', type: 'date', gridColumns: 6, gridSmColumns: 12 },
      { property: 'status', label: 'Status', tag: true, gridColumns: 6, gridSmColumns: 12 },
      { property: 'cnpj', label: 'CNPJ', gridColumns: 6, gridSmColumns: 12 },
      { property: 'priceTable', label: 'Tabela de Preço', gridColumns: 6, gridSmColumns: 12 },
      { property: 'paymentCondition', label: 'Cond. Pagamento', gridColumns: 6, gridSmColumns: 12 },
      { property: 'discountPercent', label: '% Desconto', gridColumns: 6, gridSmColumns: 12 },
      { property: 'purchaseOrder', label: 'Pedido de Compra', gridColumns: 6, gridSmColumns: 12 },
      { property: 'issueDate', label: 'Data Emissão', type: 'date', gridColumns: 6, gridSmColumns: 12 },
      { property: 'fileName', label: 'Arquivo', gridColumns: 6, gridSmColumns: 12 },
      { property: 'observation', label: 'Observações', gridColumns: 12 }
    ];
  }

  public GetImportsColumns(): PoTableColumn[] {
    return [
      { property: 'salesOrder', label: 'Pedido de Venda', width: '150px' },
      { property: 'date', label: 'Data', type: 'date', width: '150px' },
      { property: 'fileName', label: 'Arquivo', width: '200px' },
      {
        property: 'status', label: 'Status', type: 'label', width: '150px',
        labels: [
          { value: 'I', label: 'Integrado', color: 'color-04' },
          { value: 'E', label: 'Erro', color: 'color-08' }
        ]
      },
      { property: 'cnpj', label: 'CNPJ', width: '150px' },
      { property: 'priceTable', label: 'Tabela de Preço', width: '150px' },
      { property: 'paymentCondition', label: 'Cond. Pagamento', width: '150px' },
      { property: 'discountPercent', label: '% Desconto', width: '120px' },
      { property: 'purchaseOrder', label: 'Pedido de Compra', width: '150px' },
      { property: 'issueDate', label: 'Data Emissão', type: 'date', width: '130px' }
    ];
  }

  public async GetImportsItems(filter: string): Promise<Import[]> {
    const salesmanId = this.authService.getSession()?.sessionInfo?.userId;
    if (!salesmanId) return [];

    const url = `${environment.apiDomain}/imports?salesmanId=${salesmanId}&filter=${filter}`;
    const response: any = await this.http.get(url, environment.header).toPromise();
    return response?.items ?? [];
  }

  public async PostImportItem(payload: any): Promise<any> {
    try {
      return await this.http.post(this.importUrl, payload, environment.header).toPromise();
    } catch (error: any) {
      console.error('Erro ao importar item:', error);
      return error.error ?? error;
    }
  }

  public async parseXlsxToGroupedJson(buffer: ArrayBuffer): Promise<any[]> {
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

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

    for (const row of rawData) {
      const item: any = {};
      for (const key in headerMap) {
        item[headerMap[key]] = row[key] ?? '';
      }

      if (!pedidosMap.has(item.pedidoCliente)) {
        pedidosMap.set(item.pedidoCliente, {
          CNPJ: item.CNPJ,
          C5_TPFRETE: item.C5_TPFRETE,
          C5_MENNOTA: item.C5_MENNOTA,
          C5_PEDCLI: item.pedidoCliente,
          ITENS: []
        });
      }

      pedidosMap.get(item.pedidoCliente).ITENS.push({
        C6_ITEM: item.itemPedido,
        C6_PRODUTO: item.produto,
        C6_QTDVEN: Number(item.quantidade),
        C6_OPER: '01'
      });
    }

    return Array.from(pedidosMap.values());
  }
}
