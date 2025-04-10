import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const loginGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const isLogged = cookieService.get('isLogged') === 'true';

  if (isLogged) {
    router.navigate(['/Portal']);
    return false;
  }

  return true;
}
