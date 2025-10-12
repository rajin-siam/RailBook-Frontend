import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes (no authentication required)
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },

  // Protected routes (authentication required)
  // The authGuard checks if user is logged in before allowing access
  { 
    path: '', 
    component: BookingFormComponent,
    canActivate: [authGuard] // 🔒 This protects the route
  },
  { 
    path: 'booking/:id', 
    component: BookingDetailsComponent,
    canActivate: [authGuard] // 🔒 This protects the route
  },

  // Redirect any unknown routes to home
  { 
    path: '**', 
    redirectTo: '' 
  }
];