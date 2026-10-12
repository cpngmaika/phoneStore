import { apiClient } from "@/api/client";
import { apiEndpoints } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUser,
} from "@/types/user.types";

export interface UserFilterParams {
  keyword?: string;
  role?: string;
  status?: string;
}

export const adminUserService = {
  async getUsers(params?: UserFilterParams): Promise<AdminUser[]> {
    const query = new URLSearchParams();
    if (params?.keyword) query.set("keyword", params.keyword);
    if (params?.role) query.set("role", params.role);
    if (params?.status) query.set("status", params.status);

    const queryString = query.toString();
    const endpoint = `${apiEndpoints.admin.users}${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient<ApiResponse<AdminUser[]>>(endpoint, {
      method: "GET",
    });

    return response?.data ?? [];
  },

  async getUserById(id: number): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>(
      `${apiEndpoints.admin.users}/detail?id=${id}`,
      {
        method: "GET",
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "User not found");
    }

    return response.data;
  },

  async createUser(payload: AdminCreateUserRequest): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>(
      `${apiEndpoints.admin.users}/create`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to create user");
    }

    return response.data;
  },

  async updateUser(
    id: number,
    payload: AdminUpdateUserRequest,
  ): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>(
      `${apiEndpoints.admin.users}/update?id=${id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to update user");
    }

    return response.data;
  },

  async toggleStatus(
    id: number,
    status: "ACTIVE" | "LOCKED" | "INACTIVE",
  ): Promise<AdminUser> {
    const response = await apiClient<ApiResponse<AdminUser>>(
      `${apiEndpoints.admin.users}/toggle-status?id=${id}&status=${status}`,
      {
        method: "POST",
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to update user status");
    }

    return response.data;
  },
};
