import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(
    private http: HttpClient
  ) { }


  public async SendPasswordRecovery(recoveryInfo: any): Promise<any>{ 
    
    const url: string = `http://200.229.234.214:8091/rest/valclei/recuperasenha`;

    try {
      const response: any = await this.http.post(url, recoveryInfo, environment.header).toPromise();
      return response;
    } catch (error: any) {
      console.log('Erro completo:', error);
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
      return { codigo: "400", mensagem: errorMessage };
    }
    
  }
}
