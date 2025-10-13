export interface User {
  userId: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
  statusCode: number;
}