import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  public GetProfileFields(): PoDynamicViewField[]{
    return [
      {
        property: 'name',
        label: 'Nome',
        divider: 'Geral'
      },
      {
        property: 'code',
        label: 'Código do Vendedor',
      },
      {
        property: 'cpf',
        label: 'CPF',
      },
      {
        property: 'email',
        label: 'E-mail',
        divider: 'Contato'
      },
      {
        property: 'phone',
        label: 'Telefone',
      },
      {
        property: 'cellPhone',
        label: 'Celular',
      },
      {
        property: 'address',
        label: 'Endereço',
        divider: 'Endereço'
      },
      {
        property: 'city',
        label: 'Cidade',
      },
      {
        property: 'state',
        label: 'Estado',
      },
      {
        property: 'zipCode',
        label: 'CEP',
      },
      {
        property: 'commissionRate',
        label: 'Taxa de Comissão',
        divider: 'Comissões'
      },
    ]; 
  }

  public async GetSalesmanInfo(): Promise<any[]>{
    const salesmanId = this.cookieService.get('salesmanId');
    const url: string = `${environment.apiDomain}/salesman?salesmanId=${salesmanId}`;

    const response: any = await this.http.get(url, environment.header).toPromise();
    
    return response['salesmanInfo'];
  }
}
