import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal/portal.component';
import { CustomersComponent } from './customers/customers.component';
import { MenubarComponent } from './menubar/menubar.component';
import { PortalRoutingModule } from './portal-routing.module';
import { PoModule } from '@po-ui/ng-components';
import { SalesRequestsComponent } from './sales-requests/sales-requests.component';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProfileComponent } from './profile/profile.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { GenericComponentsModule } from '../../genericComponents/generic-components.module';
import { ImportsComponent } from './imports/imports.component';
import { SalesBudgetsComponent } from './sales-budgets/sales-budgets.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { SalesRequestHeaderModalComponent } from './sales-requests/modals/sales-request-header-modal/sales-request-header-modal.component';
import { SalesRequestItemModalComponent } from './sales-requests/modals/sales-request-item-modal/sales-request-item-modal.component';
import { SalesBudgetHeaderModalComponent } from './sales-budgets/modals/sales-budget-header-modal/sales-budget-header-modal.component';
import { SalesBudgetItemModalComponent } from './sales-budgets/modals/sales-budget-item-modal/sales-budget-item-modal.component';

@NgModule({
  declarations: [
    PortalComponent,
    CustomersComponent,
    MenubarComponent,
    SalesRequestsComponent,
    InvoicesComponent,
    ProfileComponent,
    CommissionsComponent,
    ImportsComponent,
    SalesBudgetsComponent,
    HomeComponent,
    SalesRequestHeaderModalComponent,
    SalesRequestItemModalComponent,
    SalesBudgetHeaderModalComponent,
    SalesBudgetItemModalComponent,
    SalesBudgetHeaderModalComponent,
    SalesBudgetItemModalComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    PoModule,
    PoTemplatesModule,
    GenericComponentsModule,
    FormsModule
  ]
})
export class PortalModule { }
