import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Form to capture email and password
  loginForm: FormGroup;
  
  // Track submission state
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Must be a valid email
      password: ['', [Validators.required, Validators.minLength(6)]] // At least 6 characters
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Check if form is valid
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Call the auth service to login
      this.authService.login(this.loginForm.value).subscribe({
        // Success callback
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Login successful!';
            
            // Check if there's a returnUrl (where user was trying to go before login)
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            
            // Redirect after a short delay
            setTimeout(() => {
              this.router.navigate([returnUrl]);
            }, 1000);
          }
        },
        // Error callback
        error: (error) => {
          this.isSubmitting = false;
          
          // Show user-friendly error message
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
          
          console.error('Login error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.loginForm);
    }
  }

  /**
   * Helper method to mark all form fields as touched
   * This makes validation errors visible
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Helper method to check if a field has errors and was touched
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }
}