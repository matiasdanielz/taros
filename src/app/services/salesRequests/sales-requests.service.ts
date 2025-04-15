import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicFormField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { CustomersService } from '../customers/customers.service';
import { PaymentConditionsService } from '../paymentConditions/payment-conditions.service';
import { PriceTablesService } from '../priceTables/price-tables.service';
import { ProductsService } from '../products/products.service';
import { OperationsService } from '../operations/operations.service';


@Injectable({
  providedIn: 'root'
})
export class SalesRequestsService {

  constructor(
    private http: HttpClient,
    private customersService: CustomersService,
    private paymentConditionsService: PaymentConditionsService,
    private priceTableService: PriceTablesService,
    private productsService: ProductsService,
    private operationsService: OperationsService
  ) { }

  public async GetSalesRequestTaxes(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/imposto`;
  
    try {
      const response: any = await this.http.get(url, environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }

  public async PostSalesRequest(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/pedidovenda`;
  
    try {
      const response: any = await this.http.post(url, body, environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }


  public async DeleteSalesRequest(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/pedidovenda`;
  
    const options = {
      ...environment.header, // pega os headers do environment
      body: body              // adiciona o body na requisição
    };
  
    try {
      const response: any = await this.http.delete(url, options).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }
  
  /*
  **********
  **********
  CABEÇALHO
  **********
  **********
  */
  public GetSalesRequestsHeaderFields(): PoDynamicFormField[] {
    return [
      {
        property: 'C5_CLIENTE',
        label: 'Cliente',
        divider: 'Cabeçalho',
        searchService: this.customersService,
        fieldValue: 'id',
        fieldLabel: 'name',
        columns: [
          {
            property: 'id',
            label: 'Codigo'
          },
          {
            property: 'name',
            label: 'Nome'
          }
        ],
        required: true,
        showRequired: true,
        gridColumns: 6
      },
      {
        property: 'C5_TPFRETE',
        label: 'Tipo De Frete',
        required: true,
        showRequired: true,
        options: [
          {
            value: 'C',
            label: 'CIF'
          },
          {
            value: 'F',
            label: 'FOB'
          },
          {
            value: 'T',
            label: 'Por Terceiros'
          },
          {
            value: 'R',
            label: 'Por Remetente'
          },
          {
            value: 'D',
            label: 'Pelo Destinatario'
          },
          {
            value: 'S',
            label: 'Sem Frete'
          },
        ],
        gridColumns: 6
      },
      {
        property: 'C5_MENNOTA',
        label: 'Msg Nota',
        gridColumns: 12,
        rows: 3
      },
    ];
  }

  public GetSalesRequestsHeaderColumns(): PoTableColumn[] {
    return [
      {
        property: 'branch',
        label: 'Filial',
        width: '120px'
      },      
      {
        property: 'status',
        label: 'Status',
        type: 'label',
        labels: [
          {
            value: 'emAberto',
            label: 'Em Aberto',
            color: 'color-04'
          },
          {
            value: 'encerrado',
            label: 'Encerrado',
            color: 'color-05'
          },
          {
            value: 'liberado',
            label: 'Liberado',
            color: 'color-06'
          },
          {
            value: 'bloqueadoPorRegra',
            label: 'Bloqueado Por Regra',
            color: 'color-07'
          },
          {
            value: 'bloqueadoPorVerba',
            label: 'Bloqueado Por Verba',
            color: 'color-08'
          },
          {
            value: 'bloqueadoPorEstoque',
            label: 'Bloqueado Por Estoque',
            color: 'color-09'
          },
          {
            value: 'naoIdentificado',
            label: 'Não Identificado',
            color: 'color-10'
          },
        ],
        width: '150px'
      },
      {
        property: 'orderNumber',
        label: 'Pedido',
        width: "100px"
      },
      {
        property: "customerCode",
        label: "Código do Cliente",
        width: "150px"
      },
      {
        property: "store",
        label: "Loja",
        width: "75px"
      },
      {
        property: "customerName",
        label: "Nome do Cliente",
        width: "250px"
      },
      {
        property: "issueDate",
        label: "Data de Emissão",
        type: 'date',
        width: "150px"
      },
      {
        property: "discount",
        label: "Desconto",
        width: "150px"
      },
      {
        property: "priceTable",
        label: "Tabela De Preço",
        width: "150px"
      },
      {
        property: "carrier",
        label: "Transportadora",
        width: "150px"
      },
      {
        property: "paymentCondition",
        label: "Condição de Pagamento",
        width: "200px"
      },
      {
        property: 'shippingMethod',
        label: 'Tipo De Frete',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: 'C',
            label: 'CIF',
            color: 'color-04'
          },
          {
            value: 'F',
            label: 'FOB',
            color: 'color-05'
          },
          {
            value: 'T',
            label: 'Por Terceiros',
            color: 'color-06'
          },
          {
            value: 'R',
            label: 'Por Remetente',
            color: 'color-07'
          },
          {
            value: 'D',
            label: 'Pelo Destinatario',
            color: 'color-08'
          },
          {
            value: 'S',
            label: 'Sem Frete',
            color: 'color-09'
          }
        ]
      }
    ]
  }

  public async GetSalesRequestsItems(page?: number, pageSize?: number, filter?: string): Promise<any[]> {
    const url: string = `${environment.apiDomain}/salesRequests?` +
      `page=${page}` +
      `&pageSize=${pageSize}` +
      `&filter=${filter}`;

    const response: any = await this.http.get(url, environment.header).toPromise();

    return response['items'];
  }

  /*
  **********
  **********
  ITENS
  **********
  **********
  */

  public GetSalesRequestsItemsFields(): PoDynamicFormField[]{
    return [
      {
        property: 'C6_ITEM',
        label: 'Item',
        readonly: true,
        visible: false,
        gridColumns: 6
      },
      {
        property: 'C6_PRODUTO',
        label: 'Produto',
        searchService: this.productsService,
        columns: [
          {
            property: 'value',
            label: 'Codigo'
          },
          {
            property: 'label',
            label: 'Descrição'
          }
        ],
        required: true,
        showRequired: true,
        gridColumns: 6
      },
      {
        property: 'C6_QTDVEN',
        label: 'Qtde Vendida',
        type: 'number',
        required: true,
        showRequired: true,
        gridColumns: 6
      },
    ];
  }

  public GetSalesRequestsItemsColumns(): PoTableColumn[]{
    return [
      {
        property: 'C6_ITEM',
        label: 'Item',
      },
      {
        property: 'C6_PRODUTO',
        label: 'Produto'
      },
      {
        property: 'C6_QTDVEN',
        label: 'Qtde Vendida'
      },
      {
        property: 'IT_PRCUNI',
        label: 'Preço De Venda'
      },
      {
        property: 'IT_VALMERC',
        label: 'Valor Da Mercadoria'
      },
      {
        property: 'IT_VALICM',
        label: 'Valor ICM'
      },
      {
        property: 'IT_VALSOL',
        label: 'Valor Solidario'
      },
      {
        property: 'IT_VALIPI',
        label: 'Valor IPI'
      },
      {
        property: 'IT_DIFAL',
        label: 'DIFAL'
      },
      {
        property: 'IT_SLDPROD',
        label: 'Saldo Produto'
      },
    ];
  }
}
