import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }
  
  public GetCustomerColumns(): PoTableColumn[]{
    return [
      {
        property: 'id',
        label: 'Código',
        width: '100px'
      },
      {
        property: 'store',
        label: 'Loja',
      },
      {
        property: 'name',
        label: 'Nome',
        width: '200px'
      },
      {
        property: 'fantasyName',
        label: 'Nome Reduzido',
        width: '200px'
      },
      {
        property: 'type',
        label: 'Tipo de Cliente',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: 'L',
            label: 'Prod. Rural',
            color: 'color-01'
          },
          {
            value: 'F',
            label: 'Cons. Final',
            color: 'color-03'
          },
          {
            value: 'R',
            label: 'Revendedor',
            color: 'color-05'
          },
          {
            value: 'S',
            label: 'ICMS Solid.',
            color: 'color-07'
          },
          {
            value: 'X',
            label: 'Exportação',
            color: 'color-09'
          },
        ]
      },
      {
        property: 'person',
        label: 'Pessoa (F/J)',
        width: '150px',
        type: 'label',
        labels: [
          {
            value: 'J',
            label: 'Juridica',
            color: 'color-08'
          },
          {
            value: 'F',
            label: 'Fisica',
            color: 'color-10'
          }
        ]
      },
      {
        property: 'brazilianTaxId',
        label: 'CNPJ/CPF',
        width: '150px'
      },
      {
        property: 'stateInscription',
        label: 'Inscrição Estadual',
        width: '200px'
      },
      {
        property: 'adress',
        label: 'Endereço',
        width: '200px'
      },
      {
        property: 'neighborhood',
        label: 'Bairro',
        width: '200px'
      },
      {
        property: 'city',
        label: 'Cidade',
        width: '200px'
      },
      {
        property: 'state',
        label: 'Estado',
        width: '200px'
      },
      {
        property: 'zip',
        label: 'CEP',
        width: '200px'
      },
      {
        property: 'phone',
        label: 'Telefone',
        width: '200px'
      },
      {
        property: 'email',
        label: 'E-mail',
        width: '200px'
      }      
    ];
  }

  public async GetCustomersItems(page?: number, pageSize?: number, filter?: string): Promise<any[]>{    
    const url: string = `${environment.apiDomain}/customers?`+
      `page=${page}` + 
      `&pageSize=${pageSize}` + 
      `&filter=${filter}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['items'];
  }
}
