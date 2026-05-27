import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional Route Guard: Permits routing only if user is logged in.
 * Redirects to /login on failure.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Functional Route Guard: Permits routing only if logged-in user is an Admin.
 * Redirects to /dashboard on failure.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated && authService.isAdmin) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
