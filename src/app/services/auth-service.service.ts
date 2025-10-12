import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

// These interfaces match your backend DTOs
interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
  };
  statusCode: number;
}

interface CurrentUser {
  userId: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root' // This makes the service available throughout the app
})
export class AuthService {
  // Base URL for authentication endpoints
  private apiUrl = 'http://localhost:5145/api/Auth';
  
  // BehaviorSubject keeps track of current user state
  // It starts with null (no user logged in)
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  
  // Observable that components can subscribe to
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user was previously logged in
    this.loadUserFromStorage();
  }

  /**
   * REGISTER - Create a new user account
   */
  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          // If registration is successful, save the tokens
          if (response.success) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  /**
   * LOGIN - Authenticate existing user
   */
  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          // If login is successful, save the tokens
          if (response.success) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  /**
   * LOGOUT - Clear user session
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        })
      );
  }

  /**
   * REFRESH TOKEN - Get a new access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {
      accessToken,
      refreshToken
    }).pipe(
      tap(response => {
        if (response.success) {
          this.saveAuthData(response.data);
        }
      })
    );
  }

  /**
   * Save authentication data to localStorage
   * localStorage is like a storage box in the browser that persists even after closing
   */
  private saveAuthData(data: any): void {
    // Store tokens
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // Store user info
    const user: CurrentUser = {
      userId: data.userId,
      name: data.name,
      email: data.email
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update the BehaviorSubject so all subscribers get notified
    this.currentUserSubject.next(user);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Load user data from localStorage when app starts
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Get current user information
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }
}