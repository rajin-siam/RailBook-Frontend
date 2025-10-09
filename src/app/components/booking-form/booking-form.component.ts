import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  bookingForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  cities = ['Dhaka', 'Chittagong', 'Barishal', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Tangail'];
  genders = ['Male', 'Female', 'Other'];
  availableServices = [
    { name: 'Lunch Meal', price: 150 },
    { name: 'Dinner Meal', price: 180 },
    { name: 'Kids Meal', price: 100 },
    { name: 'AC Blanket', price: 50 },
    { name: 'Pillow', price: 30 }
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      bookingDate: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      perTicketPrice: ['', [Validators.required, Validators.min(1)]],
      passengers: this.fb.array([])
    });

    this.addPassenger();
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  getServices(passengerIndex: number): FormArray {
    return this.passengers.at(passengerIndex).get('trainServices') as FormArray;
  }

  addPassenger(): void {
    const passengerGroup = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      trainServices: this.fb.array([])
    });

    this.passengers.push(passengerGroup);
  }

  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.removeAt(index);
    }
  }

  addService(passengerIndex: number): void {
    const serviceGroup = this.fb.group({
      serviceName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.getServices(passengerIndex).push(serviceGroup);
  }

  removeService(passengerIndex: number, serviceIndex: number): void {
    this.getServices(passengerIndex).removeAt(serviceIndex);
  }

  selectService(passengerIndex: number, serviceName: string, price: number): void {
    const serviceGroup = this.fb.group({
      serviceName: [serviceName, Validators.required],
      price: [price, [Validators.required, Validators.min(0)]]
    });

    this.getServices(passengerIndex).push(serviceGroup);
  }

  calculateTotal(): number {
    const perTicketPrice = this.bookingForm.get('perTicketPrice')?.value || 0;
    const passengersCount = this.passengers.length;
    let servicesTotal = 0;

    this.passengers.controls.forEach(passenger => {
      const services = passenger.get('trainServices') as FormArray;
      services.controls.forEach(service => {
        servicesTotal += service.get('price')?.value || 0;
      });
    });

    return (perTicketPrice * passengersCount) + servicesTotal;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.bookingForm.value;
      const booking: Booking = {
        ...formValue,
        bookingDate: new Date(formValue.bookingDate).toISOString()
      };

      this.bookingService.createBooking(booking).subscribe({
        next: (response) => {
          if (response.success && response.data.id) {
            this.router.navigate(['/booking', response.data.id]);
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to create booking. Please try again.';
          this.isSubmitting = false;
          console.error('Booking error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.bookingForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}