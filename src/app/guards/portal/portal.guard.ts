import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

export const portalGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLogged = authService.isLoggedIn();

  if (!isLogged) {
    router.navigate(['/Authentication']);
    return false;
  }

  return true;
};
