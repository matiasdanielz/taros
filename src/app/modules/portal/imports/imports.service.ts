import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
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
    const salesmanId = this.cookieService.get('salesmanId');
    const url: string = `${environment.apiDomain}/imports?salesmanId=${salesmanId}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }

  public async PostImportItem(importItem: any): Promise<any>{
    const url: string = `http://200.229.234.214:8091/rest/valclei/integracao`;

    const response: any = await this.http.post(url, importItem,environment.header).toPromise();
    
    return response;
  }

  public async ConvertExcelFileToJson(file: File): Promise<any[]> {
    const workbook = new Workbook();
    const arrayBuffer = await file.arrayBuffer();
  
    await workbook.xlsx.load(arrayBuffer);
  
    const worksheet = workbook.worksheets[0];
    const result: any[] = [];
  
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // pular cabeçalho
  
      result.push({
        cnpj: row.getCell(1).text,
        pedidoCliente: row.getCell(2).text,
        itemDoPedido: row.getCell(3).text,
        produto: row.getCell(4).text,
        quantidade: row.getCell(5).value
      });
    });
  
    return result;
  }
}
