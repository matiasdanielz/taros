import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn, PoDynamicFormField, PoDynamicViewField } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesBudgetsService {

constructor(
    private http: HttpClient,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  public async GetSalesBudgetTaxes(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/imposto`;
  
    try {
      const response: any = await this.http.post(url, body,environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de orçamento de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }

  public async PostSalesBudget(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/orcamento`;
  
    try {
      const response: any = await this.http.post(url, body, environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }

  public async PutSalesBudget(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/orcamento`;
  
    try {
      const response: any = await this.http.put(url, body, environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }

  public async DeleteSalesBudget(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/orcamento`;
  
    const options = {
      ...environment.header, // pega os headers do environment
      body: body              // adiciona o body na requisição
    };
  
    try {
      const response: any = await this.http.delete(url, options).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de orçamento de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }

  
  public async AproveSalesBudget(requestJson: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/aprovaorcamento`;
  
    try {
      const response: any = await this.http.post(url, requestJson, environment.header).toPromise();
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
  public GetSalesBudgetsHeaderFields(): any {
    return [
      {
        property: 'CJ_CLIENTE',
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
        property: 'CJ_TPFRETE',
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
        property: 'paymentConditionName',
        label: 'Condição De Pagamento',
        readonly: true,
        gridColumns: 6
      },
      {
        property: 'priceTableName',
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
        property: 'shopOrderId',
        label: 'Codigo Do Pedido em Ecommerce',
        gridColumns: 12
      },
    ];
  }

  public GetSalesBudgetsHeaderColumns(): PoTableColumn[] {
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
            value: 'A',
            label: 'Em Aberto',
            color: 'color-10'
          },
          {
            value: 'B',
            label: 'Aprovado',
            color: 'color-06'
          },
          {
            value: 'C',
            label: 'Cancelado',
            color: 'color-05'
          },
          {
            value: 'D',
            label: 'Não Orçado',
            color: 'color-08'
          }
        ],
        width: '125px'
      },
      {
        property: 'orderNumber',
        label: 'Orçamento',
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

  public async GetSalesBudgetsItems(filter?: string): Promise<any[]> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;    const url: string = `${environment.apiDomain}/salesBudgets?` +
      `salesmanId=${salesmanId}` +
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

  public GetSalesBudgetsItemsFields(customerId: string): PoDynamicFormField[]{
    return [
      {
        property: 'CK_ITEM',
        label: 'Item',
        readonly: true,
        visible: false,
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'CK_PRODUTO',
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
        gridColumns: 6,
        gridSmColumns: 12
      },
      {
        property: 'CK_QTDVEN',
        label: 'Qtde Vendida',
        type: 'number',
        required: true,
        showRequired: true,
        gridColumns: 6,
        gridSmColumns: 12
      },
    ];
  }

  public GetSalesBudgetsItemsColumns(): PoTableColumn[]{
    return [
      {
        property: 'CK_ITEM',
        label: 'Item',
        width: '125px'
      },
      {
        property: 'CK_PRODUTO',
        label: 'Produto',
        width: '200px'
      },
      {
        property: 'B1_DESC',
        label: 'Desc Produto',
        width: '200px'
      },
      {
        property: 'CK_QTDVEN',
        label: 'Qtde Vendida',
        width: '130px'
      },
      {
        property: 'IT_PRCUNI',
        label: 'Preço De Venda',
        width: '125px'
      },
      {
        property: 'IT_VALMERC',
        label: 'Valor Da Mercadoria',
        width: '170px'
      },
      {
        property: 'IT_VALICM',
        label: 'Valor ICM',
        width: '130px'
      },
      {
        property: 'IT_VALSOL',
        label: 'ICMS / ST',
        width: '125px'
      },
      {
        property: 'IT_VALIPI',
        label: 'Valor IPI',
        width: '130px'
      },
      {
        property: 'IT_DIFAL',
        label: 'DIFAL',
        width: '100px'
      },
      {
        property: 'IT_SLDPROD',
        label: 'Saldo Produto',
        width: '140px'
      }
    ];    
  }

    public GetSalesBudgetsItemsDynamicViewFields(): PoDynamicViewField[]{
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
