import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { AdminStats } from "@/types/admin.types";
import type { ApiOrder, OrderStatus } from "@/types/order.types";
import type {
  AdminUserCreateRequest,
  AdminUserUpdateRequest,
  ApiUser,
} from "@/types/user.types";

export type AdminUserFilters = {
  keyword?: string;
  role?: ApiUser["role"];
  status?: ApiUser["status"];
};

export async function getAdminUsers(filters: AdminUserFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.size ? `?${params.toString()}` : "";
  return requestData<ApiUser[]>(
    `${apiEndpoints.admin.users}${query}`,
  );
}

export function getAdminUserById(id: number | string) {
  const params = new URLSearchParams({ id: String(id) });
  return requestData<ApiUser>(
    `${apiEndpoints.admin.userDetail}?${params}`,
  );
}

export function createAdminUser(payload: AdminUserCreateRequest) {
  return requestData<ApiUser>(apiEndpoints.admin.createUser, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminUser(
  id: number | string,
  payload: AdminUserUpdateRequest,
) {
  const params = new URLSearchParams({ id: String(id) });
  return requestData<ApiUser>(
    `${apiEndpoints.admin.updateUser}?${params}`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function toggleAdminUserStatus(
  id: number | string,
  status: ApiUser["status"],
) {
  const params = new URLSearchParams({ id: String(id), status });
  return requestData<ApiUser>(
    `${apiEndpoints.admin.toggleUserStatus}?${params}`,
    { method: "POST" },
  );
}

export function getAdminOrders() {
  return requestData<ApiOrder[]>(apiEndpoints.admin.orders);
}

export function getAdminStats() {
  return requestData<AdminStats>(apiEndpoints.admin.stats);
}

export function updateOrderStatus(id: number | string, status: OrderStatus) {
  const params = new URLSearchParams({ status });
  return requestData<ApiOrder>(
    `${apiEndpoints.admin.updateOrderStatus(id)}?${params}`,
    { method: "PUT" },
  );
}
