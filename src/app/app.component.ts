import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookingFormComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ticket-booking-system';
}
