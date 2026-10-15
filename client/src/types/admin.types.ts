import type { ApiOrder } from "@/types/order.types";

export type AdminDailyRevenue = {
  date: string;
  revenue: number;
};

export type AdminBestSeller = {
  productId: number;
  productName: string;
  quantity: number;
  revenue: number;
};

export type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  productsInStock: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  dailyRevenue: AdminDailyRevenue[];
  bestSellers: AdminBestSeller[];
  recentOrders: ApiOrder[];
};
