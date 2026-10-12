import { apiClient } from "@/api/client";
import { apiEndpoints } from "@/api/endpoints";
import type { ApiResponse } from "@/types/auth.types";
import type { Address, AddressRequest } from "@/types/user.types";

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient<ApiResponse<Address[]>>(
      apiEndpoints.users.addresses,
      {
        method: "GET",
      },
    );

    return response?.data ?? [];
  },

  async addAddress(payload: AddressRequest): Promise<Address> {
    const response = await apiClient<ApiResponse<Address>>(
      apiEndpoints.users.addresses,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response?.data) {
      throw new Error(response?.message || "Failed to add address");
    }

    return response.data;
  },

  async deleteAddress(addressId: number): Promise<void> {
    const response = await apiClient<ApiResponse<null>>(
      `${apiEndpoints.users.addresses}?id=${addressId}`,
      {
        method: "DELETE",
      },
    );

    if (response && response.success === false) {
      throw new Error(response.message || "Failed to delete address");
    }
  },

  async setDefaultAddress(addressId: number): Promise<void> {
    const response = await apiClient<ApiResponse<null>>(
      `${apiEndpoints.users.addresses}/set-default?id=${addressId}`,
      {
        method: "POST",
      },
    );

    if (response && response.success === false) {
      throw new Error(response.message || "Failed to set default address");
    }
  },
};
