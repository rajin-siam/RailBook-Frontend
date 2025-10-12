import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service.service';

/**
 * HTTP INTERCEPTOR
 * This intercepts EVERY HTTP request and automatically adds the JWT token
 * Think of it as a security guard that checks every request leaving your app
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the AuthService to get the token
  const authService = inject(AuthService);
  
  // Get the access token from localStorage
  const token = authService.getAccessToken();

  // If there's a token, add it to the request headers
  if (token) {
    // Clone the request and add the Authorization header
    // We clone because HttpRequest objects are immutable (cannot be changed)
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // This is the standard format: "Bearer <token>"
      }
    });

    // Send the modified request
    return next(authReq);
  }

  // If no token, send the original request unchanged
  return next(req);
};