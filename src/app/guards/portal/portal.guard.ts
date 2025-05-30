import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';


export const portalGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const isLogged = localStorage.getItem('salesmanId') !== '';

  if (!isLogged) {
    router.navigate(['/Authentication']);
    return false;
  }

  return true;
};
