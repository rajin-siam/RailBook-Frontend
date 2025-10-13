import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['../booking-shared.css', './booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  viewBooking(id: number): void {
    this.router.navigate(['/booking', id]);
  }

  editBooking(id: number): void {
    this.router.navigate(['/booking/edit', id]);
  }

  cancelBooking(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Booking cancelled successfully');
            this.loadBookings();
          }
        },
        error: (error) => {
          alert('Failed to cancel booking');
          console.error('Error:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || 'pending';
  }

  getTotalPassengers(booking: any): number {
    return booking.passengers?.length || 0;
  }
}
