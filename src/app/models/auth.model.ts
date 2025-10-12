// src/app/models/auth.model.ts

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
  errors: any;
  timestamp: string;
  statusCode: number;
}