import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  public getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const salesmanId = localStorage.getItem('salesmanId');
    
    console.log(salesmanId);

    const url: string = `${environment.apiDomain}/customers?` + 
    `salesmanId=${salesmanId}`;

    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
    const params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
  
    return this.http.get(url, { params, ...environment.header });
  }

  getObjectByValue(value: string, filterParams: any){
    const salesmanId = localStorage.getItem('salesmanId');
    const url: string = `${environment.apiDomain}/customers`;
    const filters = {
      "value": value
    }

    return this.http
      .get(`${url}?filter=${value}&salesmanId=${salesmanId}`)
      .pipe(map((response: any) => response['items'][0]));
  }
}
