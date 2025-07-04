import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLogged = authService.isLoggedIn();

  if (isLogged) {
    router.navigate(['/Portal']);
    return false;
  }

  return true;
};
