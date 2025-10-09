import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';

export const routes: Routes = [
  { path: '', component: BookingFormComponent },
  { path: 'booking/:id', component: BookingDetailsComponent },
  { path: '**', redirectTo: '' }
];