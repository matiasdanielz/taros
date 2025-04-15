import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesBudgetsService {

  constructor(
    private http: HttpClient
  ) { }

  public async PostSalesBudget(body: any) {
    const url: string = `http://200.229.234.214:8091/rest/valclei/pedidovenda`;
  
    try {
      const response: any = await this.http.post(url, body, environment.header).toPromise();
      return response;
    } catch (error: any) {
      const errorMessage = error?.error?.mensagem || 'Erro desconhecido na requisição de pedido de venda';
  
      return { sucesso: false, mensagem: errorMessage };
    }
  }
}
