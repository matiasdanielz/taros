import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal/portal.component';
import { CustomersComponent } from './customers/customers.component';
import { MenubarComponent } from './menubar/menubar.component';
import { PortalRoutingModule } from './portal-routing.module';
import { PoModule, PoPageModule } from '@po-ui/ng-components';
import { SalesRequestsComponent } from './sales-requests/sales-requests.component';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { NavbarComponent } from './navbar/navbar.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProfileComponent } from './profile/profile.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { AddSalesRequestHeaderModalComponent } from './sales-requests/modals/add-sales-request-header-modal/add-sales-request-header-modal.component';
import { AddSalesRequestItemModalComponent } from './sales-requests/modals/add-sales-request-item-modal/add-sales-request-item-modal.component';
import { EditSalesRequestModalComponent } from './sales-requests/modals/edit-sales-request-modal/edit-sales-request-modal.component';
import { GenericComponentsModule } from '../../genericComponents/generic-components.module';
import { SalesBudgetsComponent } from './sales-budgets/sales-budgets.component';
import { ImportsComponent } from './imports/imports.component';
import { EditSalesRequestItemModalComponent } from './sales-requests/modals/edit-sales-request-item-modal/edit-sales-request-item-modal.component';
import { AddSalesBudgetHeaderModalComponent } from './sales-budgets/modals/add-sales-budget-header-modal/add-sales-budget-header-modal.component';
import { AddSalesBudgetItemModalComponent } from './sales-budgets/modals/add-sales-budget-item-modal/add-sales-budget-item-modal.component';
import { ResultOfTaxesComponent } from './sales-requests/modals/result-of-taxes/result-of-taxes.component';

@NgModule({
  declarations: [
    PortalComponent,
    CustomersComponent,
    MenubarComponent,
    SalesRequestsComponent,
    NavbarComponent,
    InvoicesComponent,
    ProfileComponent,
    CommissionsComponent,
    AddSalesRequestHeaderModalComponent,
    AddSalesRequestItemModalComponent,
    EditSalesRequestModalComponent,
    SalesBudgetsComponent,
    ImportsComponent,
    EditSalesRequestItemModalComponent,
    AddSalesBudgetHeaderModalComponent,
    AddSalesBudgetItemModalComponent,
    ResultOfTaxesComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    PoModule,
    PoTemplatesModule,
    GenericComponentsModule
  ]
})
export class PortalModule { }
