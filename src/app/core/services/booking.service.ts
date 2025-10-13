import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:5145/api/Bookings';

  constructor(private http: HttpClient) {}

  // Get all bookings
  getAllBookings(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl);
  }

  // Create new booking
  createBooking(booking: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, booking);
  }

  // Get single booking
  getBookingById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Update booking
  updateBooking(id: number, booking: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, booking);
  }

  // Cancel booking
  cancelBooking(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, {});
  }
}