// ============================================================================
// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🎫 Create Account</h1>
          <p>Join us to book train tickets</p>
        </div>

        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              formControlName="name" 
              class="form-control"
              placeholder="Enter your full name"
              [class.error]="isFieldInvalid('name')">
            <div class="error-message" *ngIf="isFieldInvalid('name')">
              Name is required (min 2 characters)
            </div>
          </div>

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
              placeholder="Create a password"
              [class.error]="isFieldInvalid('password')">
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              formControlName="confirmPassword" 
              class="form-control"
              placeholder="Confirm your password"
              [class.error]="isFieldInvalid('confirmPassword')">
            <div class="error-message" *ngIf="registerForm.hasError('passwordMismatch')">
              Passwords do not match
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="isSubmitting">
            {{ isSubmitting ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../auth-shared.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Registration successful! Redirecting...';
            setTimeout(() => this.router.navigate(['/']), 1500);
          }
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markAllAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key: string) => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}