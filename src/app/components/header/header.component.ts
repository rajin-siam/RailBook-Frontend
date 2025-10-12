import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Track if user is logged in
  isLoggedIn = false;
  
  // Store current user's name
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    // Whenever user logs in or out, this will update automatically
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user; // !! converts to boolean (true if user exists)
      this.userName = user?.name || '';
    });
  }

  /**
   * Handle logout button click
   */
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          // Logout successful
          console.log('Logged out successfully');
        },
        error: (error: any) => {
          console.error('Logout error:', error);
          // Even if API call fails, clear local data
          this.router.navigate(['/login']);
        }
      });
    }
  }
}