import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🚂 Welcome Back!</h1>
          <p>Login to book your train tickets</p>
        </div>

        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              formControlName="email" 
              class="form-control"
              placeholder="Enter your email"
              [class.error]="isFieldInvalid('email')">
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-control"
              placeholder="Enter your password"
              [class.error]="isFieldInvalid('password')">
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password is required (min 6 characters)
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="isSubmitting">
            {{ isSubmitting ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../auth-shared.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Login successful!';
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            setTimeout(() => this.router.navigate([returnUrl]), 1000);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.status === 401 
            ? 'Invalid email or password'
            : 'Login failed. Please try again.';
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markAllAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
