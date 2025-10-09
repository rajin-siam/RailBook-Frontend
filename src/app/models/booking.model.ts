export interface TrainService {
  id?: number;
  serviceName: string;
  price: number;
  passengerId?: number;
}

export interface Passenger {
  id?: number;
  name: string;
  age: number;
  gender: string;
  bookingId?: number;
  trainServices: TrainService[];
}

export interface Invoice {
  id: number;
  bookingId: number;
  totalAmount: number;
  createdAt: string;
  invoiceDetails: any;
}

export interface Booking {
  id?: number;
  bookingDate: string;
  status?: string;
  source: string;
  destination: string;
  perTicketPrice: number;
  createdAt?: string;
  passengers: Passenger[];
  invoice?: Invoice;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  timestamp: string;
  statusCode: number;
}