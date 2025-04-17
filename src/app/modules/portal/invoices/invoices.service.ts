import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(
    private http: HttpClient
  ) { }

public GetInvoicesColumns(): PoTableColumn[]{
    return [
      {
        property: "id",
        label: "Nota",
        width: "125px"
      },
      {
        property: 'serial',
        label: 'Serie',
        width: '75px'
      },
      {
        property: "customerStore",
        label: "Loja",
        width: "75px"
      },
      {
        property: "customerId",
        label: "Id Cliente",
        width: "100px"
      },
      {
        property: "customerName",
        label: "Cliente",
        width: "250px"
      },
      {
        property: "issueDate",
        label: "Data Emissão",
        type: 'date',
        width: "130px"
      },
      {
        property: "totalValue",
        label: "Valor Total",
        width: "120px"
      },
      {
        property: 'icmsBase',
        label: 'Base ICMS',
        width: '120px'
      },
      {
        property: 'icmsValue',
        label: 'Valor ICMS',
        width: '120px'
      },
      {
        property: 'ipiBase',
        label: 'Base IPI',
        width: '120px'
      },
      {
        property: 'ipiValue',
        label: 'Valor IPI',
        width: '120px'
      },
      {
        property: 'goodsValue',
        label: 'Valor Mercadorias',
        width: '150px'
      },
      {
        property: 'icmsRetained',
        label: 'ICMS Retido',
        width: '120px'
      },
      {
        property: 'netWeight',
        label: 'Peso Líquido',
        width: '120px'
      },
      {
        property: 'grossWeight',
        label: 'Peso Bruto',
        width: '120px'
      },
      {
        property: 'carrier',
        label: 'Transportadora',
        width: '200px'
      },
      {
        property: 'otherTaxBase',
        label: 'Base Outro Imposto',
        width: '150px'
      },
      {
        property: 'otherTaxValue1',
        label: 'Outro Imposto 1',
        width: '150px'
      },
      {
        property: 'otherTaxValue2',
        label: 'Outro Imposto 2',
        width: '150px'
      },
      {
        property: 'nfApprovalDate',
        label: 'Data Autorização',
        type: 'date',
        width: '130px'
      },
      {
        property: 'nfApprovalTime',
        label: 'Hora Autorização',
        width: '120px'
      }      
    ]
  }

  public GetInvoicesFields(): PoDynamicViewField[] {
    return [
      {
        property: "id",
        label: "Nota",
        gridColumns: 6
      },
      {
        property: 'serial',
        label: 'Serie',
        gridColumns: 6
      },
      {
        property: "customerStore",
        label: "Loja",
        gridColumns: 6
      },
      {
        property: "customerId",
        label: "Id Cliente",
        gridColumns: 6
      },
      {
        property: "customerName",
        label: "Cliente",
        gridColumns: 6
      },
      {
        property: "issueDate",
        label: "Data Emissão",
        type: 'date',
        gridColumns: 6
      },
      {
        property: "totalValue",
        label: "Valor Total",
        gridColumns: 6
      },
      {
        property: 'icmsBase',
        label: 'Base ICMS',
        gridColumns: 6
      },
      {
        property: 'icmsValue',
        label: 'Valor ICMS',
        gridColumns: 6
      },
      {
        property: 'ipiBase',
        label: 'Base IPI',
        gridColumns: 6
      },
      {
        property: 'ipiValue',
        label: 'Valor IPI',
        gridColumns: 6
      },
      {
        property: 'goodsValue',
        label: 'Valor Mercadorias',
        gridColumns: 6
      },
      {
        property: 'icmsRetained',
        label: 'ICMS Retido',
        gridColumns: 6
      },
      {
        property: 'netWeight',
        label: 'Peso Líquido',
        gridColumns: 6
      },
      {
        property: 'grossWeight',
        label: 'Peso Bruto',
        gridColumns: 6
      },
      {
        property: 'carrier',
        label: 'Transportadora',
        gridColumns: 6
      },
      {
        property: 'otherTaxBase',
        label: 'Base Outro Imposto',
        gridColumns: 6
      },
      {
        property: 'otherTaxValue1',
        label: 'Outro Imposto 1',
        gridColumns: 6
      },
      {
        property: 'otherTaxValue2',
        label: 'Outro Imposto 2',
        gridColumns: 6
      },
      {
        property: 'nfApprovalDate',
        label: 'Data Autorização',
        type: 'date',
        gridColumns: 6
      },
      {
        property: 'nfApprovalTime',
        label: 'Hora Autorização',
        gridColumns: 6
      }
    ]
  }  

  public async GetInvoicesItems(page?: number, pageSize?: number, filter?: string): Promise<any[]>{    
    const url: string = `${environment.apiDomain}/invoices?`+
      `page=${page}` + 
      `&pageSize=${pageSize}` + 
      `&filter=${filter}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  } 
}
