export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItemRequest = {
  productId: number;
  quantity: number;
};

export type OrderCreateRequest = {
  items: OrderItemRequest[];
  couponCode?: string;
};

export type ApiOrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type ApiOrder = {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  couponCode: string | null;
  items: ApiOrderItem[];
};

export type ApiAdminOrder = ApiOrder;
