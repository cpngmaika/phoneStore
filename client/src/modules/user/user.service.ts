import { apiClient } from "@/api/client";
import { apiEndpoints } from "@/api/endpoints";
import type { ApiResponse, AuthUser } from "@/types/auth.types";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/types/user.types";

export const userService = {
  async getProfile(): Promise<AuthUser> {
    const response = await apiClient<ApiResponse<AuthUser>>(
      apiEndpoints.users.profile,
      {
        method: "GET",
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to load user profile");
    }

    return response.data;
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<AuthUser> {
    const response = await apiClient<ApiResponse<AuthUser>>(
      apiEndpoints.users.profile,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to update profile");
    }

    return response.data;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    const response = await apiClient<ApiResponse<null>>(
      apiEndpoints.users.password,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (response && response.success === false) {
      throw new Error(response.message || "Failed to change password");
    }
  },
};
