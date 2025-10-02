import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking, Passenger, TrainService } from '../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Import modules here!
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  // This will hold all our booking data
  booking: Booking = {
    source: '',
    destination: '',
    perTicketPrice: 0,
    passengers: []
  };

  // Add one passenger when component loads
  ngOnInit() {
    this.addPassenger();
  }

  // Function to add a new passenger
  addPassenger() {
    const newPassenger: Passenger = {
      name: '',
      age: 0,
      gender: '',
      trainServices: []
    };
    this.booking.passengers.push(newPassenger);
  }

  // Function to remove a passenger
  removePassenger(index: number) {
    this.booking.passengers.splice(index, 1);
  }

  // Function to submit the form
  onSubmit() {
    console.log('Booking Data:', this.booking);
    // We'll add API call here later
  }

  // Function to add a service to a specific passenger
  addService(passengerIndex: number) {
    const newService: TrainService = {
      serviceName: '',
      price: 0
    };
    this.booking.passengers[passengerIndex].trainServices.push(newService);
  }

  // Function to remove a service from a specific passenger
  removeService(passengerIndex: number, serviceIndex: number) {
    this.booking.passengers[passengerIndex].trainServices.splice(serviceIndex, 1);
  }
}