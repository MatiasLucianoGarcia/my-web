import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Try to restore from session
  authService.restoreSession();
  if (authService.isAuthenticated()) {
    return true;
  }

  // Try refresh token via cookie
  return from(authService.refreshToken()).pipe(
    map(() => true),
    catchError(() => {
      void router.navigate(['/admin/login'], { queryParams: { returnUrl: '/' } });
      return of(false);
    }),
  );
};
