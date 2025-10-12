import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5145/api/Bookings';

  constructor(private http: HttpClient) {}

  // Get all bookings for current user
  getAllBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl);
  }

  // Create new booking
  createBooking(booking: Booking): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, booking);
  }

  // Get booking by ID
  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`);
  }

  // Update existing booking
  updateBooking(id: number, booking: Booking): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.apiUrl}/${id}`, booking);
  }

  // Cancel booking
  cancelBooking(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, {});
  }
}