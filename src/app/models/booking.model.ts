export interface TrainService {
    serviceName: string;
    price: number;
  }
  
  export interface Passenger {
    name: string;
    age: number;
    gender: string;
    trainServices: TrainService[];
  }
  
  export interface Booking {
    source: string;
    destination: string;
    perTicketPrice: number;
    passengers: Passenger[];
  }


  export interface TrainServiceResponse {
  id: number;
  serviceName: string;
  price: number;
  passengerId: number;
}

export interface PassengerResponse {
  id: number;
  name: string;
  age: number;
  gender: string;
  bookingId: number;
  trainServices: TrainServiceResponse[];
}

export interface Invoice {
  id: number;
  bookingId: number;
  totalAmount: number;
  createdAt: string;
  invoiceDetails: any;
}

export interface BookingResponse {
  id: number;
  bookingDate: string;
  status: string;
  source: string;
  destination: string;
  perTicketPrice: number;
  createdAt: string;
  passengers: PassengerResponse[];
  invoice: Invoice;
}