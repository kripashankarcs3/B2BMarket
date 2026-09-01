import { api, setAuthToken, type ApiResponse } from './api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  company?: string;
  accountType: 'buyer' | 'supplier';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string | null;
    company: string | null;
  };
  token: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    setAuthToken(response.data.token);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    setAuthToken(response.data.token);
    return response.data;
  },

  async getMe(): Promise<AuthResponse['user']> {
    const response = await api.get<ApiResponse<AuthResponse['user']>>('/api/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    setAuthToken(null);
  },
};
