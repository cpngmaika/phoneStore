import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { ApiOrder, OrderCreateRequest } from "@/types/order.types";

export function getOrders() {
  return requestData<ApiOrder[]>(apiEndpoints.orders.list);
}

export function getOrderById(id: number | string) {
  return requestData<ApiOrder>(apiEndpoints.orders.byId(id));
}

export function createOrder(payload: OrderCreateRequest) {
  return requestData<ApiOrder>(apiEndpoints.orders.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
