import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class SalesBudgetsService {

  constructor() { }

  public GetSalesBudgetsColumns(): PoTableColumn[]{
    return [
      {

      }
    ];
  }

  public GetSalesBudgetsItems(): any[]{
    return [
      {}
    ];
  }
}
