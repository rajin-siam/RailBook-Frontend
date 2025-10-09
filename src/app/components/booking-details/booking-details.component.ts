import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(+id);
    }
  }

  loadBooking(id: number): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.booking = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load booking details';
        this.loading = false;
        console.error('Error loading booking:', error);
      }
    });
  }

  getPassengerTotal(passenger: any): number {
    const servicesTotal = passenger.trainServices.reduce((sum: number, service: any) => sum + service.price, 0);
    return (this.booking?.perTicketPrice || 0) + servicesTotal;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  printInvoice(): void {
    window.print();
  }
}
