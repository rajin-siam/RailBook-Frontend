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

  createBooking(booking: Booking): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, booking);
  }

  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`);
  }
}