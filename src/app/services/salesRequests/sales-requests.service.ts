import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicFormField, PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SalesRequestsService {

  constructor(
    private http: HttpClient,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  public async GetSalesRequestTaxes(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/imposto`;

    try {
      const response: any = await this.http.post(url, body, environment.header).toPromise();
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

  public async PutSalesRequest(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/pedidovenda`;

    try {
      const response: any = await this.http.put(url, body, environment.header).toPromise();
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
  public GetSalesRequestsHeaderFields(): PoDynamicFormField[] | PoDynamicViewField[] {
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
            label: 'Codigo',
            width: '10%'
          },
          {
            property: 'name',
            label: 'Nome'
          },
          {
            property: 'fantasyName',
            label: 'Nome Fantasia'
          },
          {
            property: 'brazilianTaxId',
            label: 'CNPJ'
          }

        ],
        required: true,
        showRequired: true,
        format:  ["id", "name"],
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'customerAdress',
        label: 'Endereço Do Cliente',
        gridColumns: 6,
        readonly: true
      },
      {
        property: 'C5_TPFRETE',
        label: 'Tipo De Frete',
        readonly: true,
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
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'paymentCondition',
        label: 'Condição De Pagamento',
        readonly: true,
        gridColumns: 6
      },
      {
        property: 'priceTable',
        label: 'Tabela De Preço',
        readonly: true,
        gridColumns: 6
      },
      {
        property: 'carrier',
        label: 'Transportadora',
        readonly: true,
        gridColumns: 6
      },
      {
        divider: 'Outros',
        property: 'C5_PEDECOM',
        label: 'Codigo Do Pedido em Ecommerce',
        gridColumns: 12
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
            color: 'color-10'
          },
          {
            value: 'encerrado',
            label: 'Encerrado',
            color: 'color-07'
          },
          {
            value: 'liberado',
            label: 'Liberado',
            color: 'color-08'
          },
          {
            value: 'bloqueadoPorRegra',
            label: 'Bloqueado Por Regra',
            color: 'color-01'
          },
          {
            value: 'bloqueadoPorVerba',
            label: 'Bloqueado Por Verba',
            color: 'color-09'
          },
          {
            value: 'bloqueadoPorEstoque',
            label: 'Bloqueado Por Estoque',
            color: 'color-05'
          },
          {
            value: 'naoIdentificado',
            label: 'Não Identificado',
            color: 'color-03'
          },
        ],
        width: '125px'
      },
      {
        property: 'orderNumber',
        label: 'Pedido',
        width: "100px"
      },
      {
        property: "customerCode",
        label: "Código do Cliente",
        width: "125px"
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
        width: "125px"
      },
      {
        property: "discount",
        label: "Desconto",
        width: "125px"
      },
      {
        property: "priceTable",
        label: "Tabela De Preço",
        width: "125px"
      },
      {
        property: "carrier",
        label: "Transportadora",
        width: "125px"
      },
      {
        property: "paymentCondition",
        label: "Condição de Pagamento",
        width: "200px"
      },
      {
        property: 'shippingMethod',
        label: 'Tipo De Frete',
        width: '125px',
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

  public async GetSalesRequestsItems(filter?: string, initialDate?: string, endDate?: string): Promise<any[]> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
    const url: string = `${environment.apiDomain}/salesRequests?` +
      `salesmanId=${salesmanId}` +
      `&initialDate=${initialDate}` +
      `&endDate=${endDate}` +
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

  public GetSalesRequestsItemsFields(customerId: string): PoDynamicFormField[] {
    return [
      {
        property: 'C6_ITEM',
        label: 'Item',
        readonly: true,
        visible: false,
        gridColumns: 6,
        gridSmColumns: 12
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
        params: {
          customerId: customerId
        },
        required: true,
        showRequired: true,
        format: ['value', 'label'],
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'C6_QTDVEN',
        label: 'Qtde Vendida',
        type: 'number',
        required: true,
        showRequired: true,
        gridColumns: 6,
        gridSmColumns: 12
      },
    ];
  }

  public GetSalesRequestsItemsColumns(): PoTableColumn[] {
    return [
      {
        property: 'C6_ITEM',
        label: 'Item',
        width: '140px' // +15
      },
      {
        property: 'C6_PRODUTO',
        label: 'Produto',
        width: '220px' // +20,
        
      },
      {
        property: 'B1_DESC',
        label: 'Desc Do Produto',
        width: '240px' // +40
      },
      {
        property: 'C6_QTDVEN',
        label: 'Qtde Vendida',
        width: '150px' // +20
      },
      {
        property: 'IT_PRCUNI',
        label: 'Preço De Venda',
        width: '150px' // +25
      },
      {
        property: 'IT_VALMERC',
        label: 'Valor Da Mercadoria',
        width: '190px' // +20
      },
      {
        property: 'IT_VALICM',
        label: 'Valor ICM',
        width: '150px' // +20
      },
      {
        property: 'IT_VALSOL',
        label: 'ICMS ST',
        width: '150px' // +25
      },
      {
        property: 'IT_VALIPI',
        label: 'Valor IPI',
        width: '150px' // +20
      },
      {
        property: 'IT_DIFAL',
        label: 'DIFAL',
        width: '120px' // +20
      },
      {
        property: 'IT_SLDPROD',
        label: 'Saldo Produto',
        width: '160px' // +20
      }
    ];
  }

  public GetSalesRequestsItemsDynamicViewFields(): PoDynamicViewField[]{
    return [
      {
        property: 'IT_VALMERC',
        label: 'Valor Da Mercadoria',
        divider: 'Somatorio',
        gridColumns: 4
      },
      {
        property: 'IT_VALICM',
        label: 'Valor ICM',
        gridColumns: 4
      },
      {
        property: 'IT_VALSOL',
        label: 'ICMS ST',
        gridColumns: 4
      },
      {
        property: 'IT_VALIPI',
        label: 'Valor IPI',
        gridColumns: 4
      },
      {
        property: 'IT_DIFAL',
        label: 'DIFAL',
        gridColumns: 4
      },
    ];
  }
  
}
