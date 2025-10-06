import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Replace this with your actual API URL
  private apiUrl = 'http://localhost:5145/api/Bookings';

  constructor(private http: HttpClient) { }

  // Function to create a booking
  createBooking(booking: Booking): Observable<any> {
    return this.http.post(this.apiUrl, booking);
  }

  // Function to get a booking by ID
  getBookingById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${id}`);
  }
}