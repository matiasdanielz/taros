import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
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
        width: "150px"
      },
      {
        property: 'serial',
        label: 'Serie',
        width: '150px'
      },
      {
        property: "client",
        label: "Cliente",
        width: "250px"
      },
      {
        property: "issueDate",
        label: "Data de Emissão",
        type: 'date',
        width: "130px"
      },
      {
        property: "dueDate",
        label: "Data de Vencimento",
        width: "130px"
      },
      {
        property: "totalValue",
        label: "Valor Total",
        width: "120px"
      },
      {
        property: "status",
        label: "Status",
        width: "100px"
      },
      {
        property: "paymentMethod",
        label: "Forma de Pagamento",
        width: "180px"
      },
      {
        property: "installments",
        label: "Parcelas",
        width: "100px"
      },
      {
        property: "discount",
        label: "Desconto",
        width: "120px"
      },
      {
        property: "salesperson",
        label: "Código do Vendedor",
        width: "120px"
      },
      {
        property: "salespersonName",
        label: "Nome do Vendedor",
        width: "200px"
      },
      {
        property: "orderNumber",
        label: "Número do Pedido",
        width: "150px"
      },
      {
        property: "nfNumber",
        label: "Número da Nota Fiscal",
        width: "150px"
      },
      {
        property: "cfop",
        label: "CFOP",
        width: "100px"
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
