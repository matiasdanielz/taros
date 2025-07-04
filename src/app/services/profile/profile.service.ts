import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

constructor(
    private http: HttpClient,
    private authService: AuthService
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

  public async GetSalesmanInfo(): Promise<User> {
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
  
    if (!salesmanId) {
      console.warn('Usuário não está logado ou sessão inválida.');
    }
  
    const url = `${environment.apiDomain}/salesman?salesmanId=${salesmanId}`;
    const response: any = await this.http.get(url, environment.header).toPromise();
  
    return response?.salesmanInfo ?? null;
  }
}
