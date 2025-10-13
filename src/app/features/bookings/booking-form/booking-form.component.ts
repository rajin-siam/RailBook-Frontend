import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['../booking-shared.css', './booking-form.component.css']
})
export class BookingFormComponent {
  bookingForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  // Static data
  cities = ['Dhaka', 'Chittagong', 'Barishal', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur'];
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
    // Initialize form
    this.bookingForm = this.fb.group({
      bookingDate: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      perTicketPrice: ['', [Validators.required, Validators.min(1)]],
      passengers: this.fb.array([])
    });

    // Add first passenger by default
    this.addPassenger();
  }

  // Get passengers array
  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  // Get services for specific passenger
  getServices(passengerIndex: number): FormArray {
    return this.passengers.at(passengerIndex).get('trainServices') as FormArray;
  }

  // Add new passenger
  addPassenger(): void {
    const passengerGroup = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      trainServices: this.fb.array([])
    });
    this.passengers.push(passengerGroup);
  }

  // Remove passenger
  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.removeAt(index);
    }
  }

  // Add service to passenger
  selectService(passengerIndex: number, serviceName: string, price: number): void {
    const serviceGroup = this.fb.group({
      serviceName: [serviceName, Validators.required],
      price: [price, [Validators.required, Validators.min(0)]]
    });
    this.getServices(passengerIndex).push(serviceGroup);
  }

  // Remove service
  removeService(passengerIndex: number, serviceIndex: number): void {
    this.getServices(passengerIndex).removeAt(serviceIndex);
  }

  // Calculate total amount
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

  // Submit form
  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formValue = this.bookingForm.value;
      const booking = {
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
      this.markAllAsTouched(this.bookingForm);
    }
  }

  private markAllAsTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      }
    });
  }
}