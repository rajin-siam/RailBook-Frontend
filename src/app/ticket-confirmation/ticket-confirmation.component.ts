import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { BookingResponse } from '../models/booking.model';

@Component({
  selector: 'app-ticket-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-confirmation.component.html',
  styleUrls: ['./ticket-confirmation.component.css']
})
export class TicketConfirmationComponent implements OnInit {
  bookingData: BookingResponse | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    // Get the booking ID from the URL
    const bookingId = this.route.snapshot.paramMap.get('id');
    
    if (bookingId) {
      this.loadBookingDetails(+bookingId);  // + converts string to number
    } else {
      this.error = 'No booking ID provided';
      this.loading = false;
    }
  }

  loadBookingDetails(id: number) {
    this.bookingService.getBookingById(id).subscribe({
      next: (response) => {
        this.bookingData = response;
        this.loading = false;
        console.log('Booking details loaded:', response);
      },
      error: (error) => {
        console.error('Failed to load booking:', error);
        this.error = 'Failed to load booking details';
        this.loading = false;
      }
    });
  }

  goBackToBooking() {
    this.router.navigate(['/']);
  }

  printTicket() {
    window.print();
  }
}