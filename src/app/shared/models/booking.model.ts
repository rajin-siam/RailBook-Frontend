export interface TrainService {
  id?: number;
  serviceName: string;
  price: number;
}

export interface Passenger {
  id?: number;
  name: string;
  age: number;
  gender: string;
  trainServices: TrainService[];
}

export interface Invoice {
  id: number;
  bookingId: number;
  totalAmount: number;
  createdAt: string;
}

export interface Booking {
  id?: number;
  bookingDate: string;
  status?: string;
  source: string;
  destination: string;
  perTicketPrice: number;
  passengers: Passenger[];
  invoice?: Invoice;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}