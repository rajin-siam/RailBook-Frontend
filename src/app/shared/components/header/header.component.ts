import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo">
          <a routerLink="/">🚂 Train Booking System</a>
        </div>

        <nav class="nav">
          <!-- Show when logged in -->
          <div *ngIf="isLoggedIn" class="nav-items">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              New Booking
            </a>
            <a routerLink="/my-bookings" routerLinkActive="active">
              My Bookings
            </a>
            <span class="greeting">Welcome, <strong>{{ userName }}</strong></span>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>

          <!-- Show when not logged in -->
          <div *ngIf="!isLoggedIn" class="nav-items">
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" class="btn-register">Register</a>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 15px 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo a {
      text-decoration: none;
      color: #2c3e50;
      font-size: 24px;
      font-weight: bold;
    }
    .nav-items {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-items a {
      text-decoration: none;
      color: #555;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s;
    }
    .nav-items a:hover, .nav-items a.active {
      color: #3498db;
      background: #f0f0f0;
    }
    .greeting { color: #555; font-size: 14px; }
    .btn-logout, .btn-register {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-logout {
      background: #e74c3c;
      color: white;
    }
    .btn-logout:hover { background: #c0392b; }
    .btn-register {
      background: #3498db;
      color: white;
      text-decoration: none;
    }
    .btn-register:hover { background: #2980b9; }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.name || '';
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => console.log('Logged out'),
        error: (err) => {
          console.error('Logout error:', err);
          this.router.navigate(['/login']);
        }
      });
    }
  }
}