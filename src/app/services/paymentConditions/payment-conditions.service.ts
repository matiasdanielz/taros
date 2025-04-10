import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentConditionsService {

  constructor(
    private http: HttpClient
  ) { }

  public getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const url: string = `${environment.apiDomain}/payConditions`;
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
    const params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
  
    return this.http.get(url, { params, ...environment.header });
  }

  getObjectByValue(value: string, filterParams: any){
    const url: string = `${environment.apiDomain}/payConditions`;
    const filters = {
      "value": value
    }

    return this.http
      .get(`${url}?value=${value}`)
      .pipe(map((response: any) => response['items'][0]));
  }
}
