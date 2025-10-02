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