// src/app/components/edit-booking/edit-booking.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-edit-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {
  bookingForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  loading = true;
  bookingId: number = 0;
  originalBooking: Booking | null = null;

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      bookingDate: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      perTicketPrice: ['', [Validators.required, Validators.min(1)]],
      passengers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingId = +id;
      this.loadBooking(this.bookingId);
    }
  }

  loadBooking(id: number): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.originalBooking = response.data;
          this.populateForm(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load booking details';
        this.loading = false;
        console.error('Error loading booking:', error);
      }
    });
  }

  populateForm(booking: Booking): void {
    // Format date for datetime-local input
    const formattedDate = new Date(booking.bookingDate).toISOString().slice(0, 16);
    
    this.bookingForm.patchValue({
      bookingDate: formattedDate,
      source: booking.source,
      destination: booking.destination,
      perTicketPrice: booking.perTicketPrice
    });

    // Populate passengers
    booking.passengers.forEach(passenger => {
      const passengerGroup = this.fb.group({
        id: [passenger.id],
        name: [passenger.name, Validators.required],
        age: [passenger.age, [Validators.required, Validators.min(1), Validators.max(120)]],
        gender: [passenger.gender, Validators.required],
        trainServices: this.fb.array([])
      });

      // Add services for this passenger
      passenger.trainServices.forEach(service => {
        const serviceGroup = this.fb.group({
          id: [service.id],
          serviceName: [service.serviceName, Validators.required],
          price: [service.price, [Validators.required, Validators.min(0)]]
        });
        (passengerGroup.get('trainServices') as FormArray).push(serviceGroup);
      });

      this.passengers.push(passengerGroup);
    });
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  getServices(passengerIndex: number): FormArray {
    return this.passengers.at(passengerIndex).get('trainServices') as FormArray;
  }

  addPassenger(): void {
    const passengerGroup = this.fb.group({
      id: [null],
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

  selectService(passengerIndex: number, serviceName: string, price: number): void {
    const serviceGroup = this.fb.group({
      id: [null],
      serviceName: [serviceName, Validators.required],
      price: [price, [Validators.required, Validators.min(0)]]
    });
    this.getServices(passengerIndex).push(serviceGroup);
  }

  removeService(passengerIndex: number, serviceIndex: number): void {
    this.getServices(passengerIndex).removeAt(serviceIndex);
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
        id: this.bookingId,
        bookingDate: new Date(formValue.bookingDate).toISOString()
      };

      this.bookingService.updateBooking(this.bookingId, booking).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Booking updated successfully!');
            this.router.navigate(['/booking', this.bookingId]);
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to update booking. Please try again.';
          this.isSubmitting = false;
          console.error('Update error:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.bookingForm);
    }
  }

  cancel(): void {
    if (confirm('Discard changes and go back?')) {
      this.router.navigate(['/my-bookings']);
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