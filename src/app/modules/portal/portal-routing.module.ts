import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { PortalComponent } from './portal/portal.component';
import { SalesRequestsComponent } from './sales-requests/sales-requests.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProfileComponent } from './profile/profile.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { ImportsComponent } from './imports/imports.component';
import { SalesBudgetsComponent } from './sales-budgets/sales-budgets.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'Home'
      },
      {
        path: 'Home',
        component: HomeComponent
      },
      {
        path: 'Customers',
        component: CustomersComponent
      },
      {
        path: 'Invoices',
        component: InvoicesComponent
      },
      {
        path: 'SalesRequests',
        component: SalesRequestsComponent
      },
      {
        path: 'Commissions',
        component: CommissionsComponent
      },
      {
        path: 'Profile',
        component: ProfileComponent
      },
      {
        path: 'SalesBudgets',
        component: SalesBudgetsComponent
      },
      {
        path: 'Imports',
        component: ImportsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
