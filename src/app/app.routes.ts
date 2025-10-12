// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { EditBookingComponent } from './components/edit-booking/edit-booking.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
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
  { 
    path: '', 
    component: BookingFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'my-bookings', 
    component: MyBookingsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'booking/:id', 
    component: BookingDetailsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'booking/edit/:id', 
    component: EditBookingComponent,
    canActivate: [authGuard]
  },

  // Redirect any unknown routes to home
  { 
    path: '**', 
    redirectTo: '' 
  }
];