import { Routes } from '@angular/router';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { TicketConfirmationComponent } from './ticket-confirmation/ticket-confirmation.component';


export const routes: Routes = [
  { path: '', component: BookingFormComponent },  // Home page - booking form
  { path: 'ticket/:id', component: TicketConfirmationComponent },  // Ticket page with ID
  { path: '**', redirectTo: '' }  // Any unknown route goes to home
];
