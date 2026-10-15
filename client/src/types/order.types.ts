export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS";

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
  imageUrl?: string | null;
  images?: string[];
};

export type ApiOrder = {
  id: number;
  orderCode: string;
  status: OrderStatus;
  orderDate?: string | null;
  totalAmount: number;
  couponCode: string | null;
  items: ApiOrderItem[];
};

export type ApiPayment = {
  id?: number;
  orderId?: number;
  method?: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string | null;
  paymentCode: string;
  qrUrl: string;
};

export type ApiAdminOrder = ApiOrder;

