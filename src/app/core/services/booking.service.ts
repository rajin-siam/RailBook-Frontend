import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:5145/api/Bookings';

  constructor(private http: HttpClient) {}

  // Get all bookings
  getAllBookings(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  // Create new booking
  createBooking(booking: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, booking);
  }

  // Get single booking
  getBookingById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  // Update booking
  updateBooking(id: number, booking: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, booking);
  }

  // Cancel booking
  cancelBooking(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}`, {});
  }
}