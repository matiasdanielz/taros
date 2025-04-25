import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MenubarService {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  public getMenubarItems(): PoMenuItem[]{
    return [
      {
        label: 'Home',
        link: 'Home',
        icon: 'po-icon-home'
      },
      {
        label: 'Clientes',
        icon: 'po-icon-users',
        link: 'Customers'
      },
      {
        label: 'Notas Fiscais',
        icon: 'po-icon-document-filled',
        link: 'Invoices'
      },
      {
        label: 'Pedidos De Venda',
        icon: 'po-icon-finance',
        link: 'SalesRequests'
      },
      {
        label: 'Orçamentos De Venda',
        icon: 'po-icon-cart',
        link: 'SalesBudgets'
      },
      {
        label: 'Importações',
        icon: 'po-icon-database',
        link: 'Imports'
      },
      {
        label: 'Comissões',
        icon: 'po-icon-chart-area',
        link: 'Commissions'
      },
      {
        label: 'Perfil',
        icon: 'po-icon-user',
        link: 'Profile'
      },
      {
        label: 'Sair',
        icon: 'po-icon-exit',
        action: () => this.LogOut()
      },
    ];
  }

  private async LogOut(){
    this.cookieService.deleteAll();
    await this.router.navigate(['/Authentication']);
  }
}
