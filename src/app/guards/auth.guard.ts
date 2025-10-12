import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
/**
 * AUTH GUARD
 * This protects routes from unauthorized access
 * If user is not logged in, they get redirected to login page
 * 
 * Think of it as a bouncer at a club - checks if you have a ticket (token)
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (authService.isLoggedIn()) {
    // User has a token, allow access
    return true;
  }

  // No token found, redirect to login
  // We also save the attempted URL so we can redirect back after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};