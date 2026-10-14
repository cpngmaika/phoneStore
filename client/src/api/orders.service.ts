import { apiEndpoints } from "@/api/endpoints";
import { getApiAssetUrl } from "@/api/client";
import { requestData } from "@/api/response";
import type { ApiOrder, OrderCreateRequest } from "@/types/order.types";

function resolveOrderImages(order: ApiOrder): ApiOrder {
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      imageUrl: getApiAssetUrl(item.imageUrl),
      images: item.images?.map((imageUrl) => getApiAssetUrl(imageUrl) ?? imageUrl),
    })),
  };
}

export function getOrders() {
  return requestData<ApiOrder[]>(apiEndpoints.orders.list).then((orders) =>
    orders.map(resolveOrderImages),
  );
}

export function getOrderById(id: number | string) {
  return requestData<ApiOrder>(apiEndpoints.orders.byId(id)).then(resolveOrderImages);
}

export function createOrder(payload: OrderCreateRequest) {
  return requestData<ApiOrder>(apiEndpoints.orders.create, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(resolveOrderImages);
}
