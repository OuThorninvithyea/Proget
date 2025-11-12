import api from "./api";
import { setItem, removeItem } from "../utils/storage";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
      memberSince: string;
      language?: string;
      theme?: string;
    };
    token: string;
  };
}

export const authService = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);

    // Store token
    if (response.success && response.data.token) {
      await setItem("authToken", response.data.token);
      await setItem("userId", response.data.user.id);
    }

    return response;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    // Store token and user ID
    if (response.success && response.data.token) {
      await setItem("authToken", response.data.token);
      await setItem("userId", response.data.user.id);
    }

    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await removeItem("authToken");
    await removeItem("userId");
  },
};

export default authService;
