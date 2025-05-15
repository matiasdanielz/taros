import { Injectable } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  public getCustomersColumns(): PoTableColumn[]{
    return [
      {
        property: 'id',
        label: 'Codigo',
        width: '20%',
      },
      {
        property: 'brazilianTaxId',
        label: 'Cpf',
        width: '20%',
      },
      {
        property: 'name',
        label: 'Nome'
      }
    ];
  }

  public getSalesRequestsColumns(): PoTableColumn[]{
    return [
      {
        property: 'status',
        label: 'Status',
        type: 'label',
        width: '20%',
        labels: [
          {
            value: 'emAberto',
            label: 'Em Aberto',
            color: 'color-10'
          },
          {
            value: 'encerrado',
            label: 'Encerrado',
            color: 'color-07'
          },
          {
            value: 'liberado',
            label: 'Liberado',
            color: 'color-08'
          },
          {
            value: 'bloqueadoPorRegra',
            label: 'Bloqueado Por Regra',
            color: 'color-01'
          },
          {
            value: 'bloqueadoPorVerba',
            label: 'Bloqueado Por Verba',
            color: 'color-09'
          },
          {
            value: 'bloqueadoPorEstoque',
            label: 'Bloqueado Por Estoque',
            color: 'color-05'
          },
          {
            value: 'naoIdentificado',
            label: 'Não Identificado',
            color: 'color-03'
          },
        ],
      },
      {
        property: 'orderNumber',
        label: 'Pedido',
        width: '20%',
      },
      {
        property: 'customerName',
        label: 'Nome Cliente'
      }
    ];
  }
}
