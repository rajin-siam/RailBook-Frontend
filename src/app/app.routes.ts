import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { BookingFormComponent } from './features/bookings/booking-form/booking-form.component';
import { BookingListComponent } from './features/bookings/booking-list/booking-list.component';
import { BookingDetailsComponent } from './features/bookings/booking-details/booking-details.component';
import { BookingEditComponent } from './features/bookings/booking-edit/booking-edit.component';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  { path: '', component: BookingFormComponent, canActivate: [authGuard] },
  { path: 'my-bookings', component: BookingListComponent, canActivate: [authGuard] },
  { path: 'booking/:id', component: BookingDetailsComponent, canActivate: [authGuard] },
  { path: 'booking/edit/:id', component: BookingEditComponent, canActivate: [authGuard] },

  // Fallback
  { path: '**', redirectTo: '' }
];