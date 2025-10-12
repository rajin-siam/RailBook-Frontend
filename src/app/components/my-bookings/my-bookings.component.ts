// src/app/components/my-bookings/my-bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
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
            this.loadBookings(); // Reload the list
          }
        },
        error: (error) => {
          alert('Failed to cancel booking');
          console.error('Error cancelling booking:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getTotalPassengers(booking: Booking): number {
    return booking.passengers?.length || 0;
  }
}