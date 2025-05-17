import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { portalGuard } from './guards/portal/portal.guard';
import { loginGuard } from './guards/login/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Authentication',
    pathMatch: 'full'
  },
  {
    path: 'Authentication',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate: [loginGuard] // aqui adiciona a proteção
  },
  {
    path: 'Portal',
    loadChildren: () => import('./modules/portal/portal.module').then(m => m.PortalModule),
    canActivate: [portalGuard] // aqui adiciona a proteção
  },
  {
    path: '**', // wildcard route
    redirectTo: 'Portal'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
