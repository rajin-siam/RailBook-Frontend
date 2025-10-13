import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  userId: number;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    userId: number;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5145/api/Auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Register new user
  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap(response => {
        if (response.success) this.saveAuthData(response.data);
      }));
  }

  // Login existing user
  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(tap(response => {
        if (response.success) this.saveAuthData(response.data);
      }));
  }

  // Logout user
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }));
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Save authentication data
  private saveAuthData(data: any): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    const user: User = {
      userId: data.userId,
      name: data.name,
      email: data.email
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  // Load user from storage on app start
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }
}