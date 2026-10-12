import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/api-response.types";

export async function requestData<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await apiClient<ApiResponse<T>>(endpoint, options);

  if (!response) {
    throw new Error("API returned an empty response.");
  }

  if (!response.success) {
    throw new Error(response.message || "API request failed.");
  }

  return response.data;
}
