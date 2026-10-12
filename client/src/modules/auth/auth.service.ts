import { apiClient } from "@/api/client";
import { apiEndpoints } from "@/api/endpoints";
import type {
  ApiResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";

export const authService = {
  async login(payload: LoginRequest): Promise<AuthUser> {
    const response = await apiClient<ApiResponse<AuthUser>>(
      apiEndpoints.auth.login,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Login failed");
    }

    return response.data;
  },

  async register(payload: RegisterRequest): Promise<AuthUser> {
    const response = await apiClient<ApiResponse<AuthUser>>(
      apiEndpoints.auth.register,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Registration failed");
    }

    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient<ApiResponse<null>>(apiEndpoints.auth.logout, {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient<ApiResponse<AuthUser>>(
        apiEndpoints.auth.currentUser,
        {
          method: "GET",
        },
      );

      return response?.data ?? null;
    } catch {
      return null;
    }
  },
};
