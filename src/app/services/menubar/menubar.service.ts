import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenubarService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  public getMenubarItems(): PoMenuItem[]{
    return [
      {
        label: 'Home',
        link: 'Home',
        icon: 'po-icon-home',
      },
      {
        label: 'Clientes',
        icon: 'po-icon-users',
        link: 'Customers'
      },
      {
        label: 'Faturamento',
        icon: 'po-icon-finance',
        subItems: [
          {
            label: 'Orçamentos de Venda',
            icon: 'po-icon-cart',
            link: 'SalesBudgets'
          },
          {
            label: 'Pedidos de Venda',
            icon: 'po-icon-finance',
            link: 'SalesRequests'
          },
          {
            label: 'Notas Fiscais',
            icon: 'po-icon-document-filled',
            link: 'Invoices'
          },
        ]
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
      }
    ]
    
  }

  private async LogOut(): Promise<void> {
    this.authService.logout();
    this.router.navigate(['/Authentication']);
  }
  
}
