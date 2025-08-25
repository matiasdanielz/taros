import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const url: string = `${environment.apiDomain}/products`;
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
    const params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
  
    return this.http.get(url, { params, ...environment.header });
  }

  public getObjectByValue(value: string, filterParams: any){
    const url: string = `${environment.apiDomain}/products`;

    return this.http
      .get(`${url}?id=${value}`)
      .pipe(map((response: any) => response['items'][0]));
  }

  public async getProductsItems(filter: string): Promise<any>{
    const session = this.authService.getSession();
    const salesmanId = session?.sessionInfo?.userId;
  
    if (!salesmanId) {
      console.warn('Usuário não está logado ou sessão inválida.');
      return [];
    }
  
    const params = new URLSearchParams();
    params.set('salesmanId', salesmanId);
    if (filter) {
      params.set('filter', filter);
    }
  
    const url = `${environment.apiDomain}/products?${params.toString()}`;
  
    const response: any = await this.http.get(url, environment.header).toPromise();
  
    return response?.items ?? [];
  }
}
