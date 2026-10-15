"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/api/admin.service";
import { formatCurrency } from "@/lib/product.utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiOrder, OrderStatus } from "@/types/order.types";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
];

export default function AdminDashboardPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    getAdminOrders()
      .then((result) => {
        if (!cancelled) setOrders(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải đơn hàng.");
      })
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function changeStatus(orderId: number, status: OrderStatus) {
    setError(null);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => order.id === orderId ? updated : order));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể cập nhật trạng thái.");
    }
  }

  if (checkingUser) return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  if (user?.role !== "ADMIN") return <main className="mx-auto max-w-6xl px-5 py-16"><p role="alert" className="text-red-700">Bạn cần quyền quản trị để xem trang này.</p><Link href="/login" className="mt-4 inline-block text-primary">Đăng nhập</Link></main>;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold text-primary">PhoneStore</p><h1 className="mt-2 text-3xl font-semibold text-text">Quản trị cửa hàng</h1></div>
        <nav className="flex gap-3 text-sm font-semibold">
          <Link href="/admin/users" className="rounded-lg border border-border px-4 py-2">Quản lý người dùng</Link>
          <Link href="/admin/products" className="rounded-lg border border-border px-4 py-2">Quản lý sản phẩm</Link>
          <Link href="/admin/coupons" className="rounded-lg border border-border px-4 py-2">Quản lý mã giảm giá</Link>
        </nav>
      </div>
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-text">Đơn hàng gần đây</h2>
        {error ? <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {loadingOrders ? <p role="status" className="mt-5 text-sm text-text-muted">Đang tải đơn hàng...</p> : null}
        {!loadingOrders && !error && orders.length === 0 ? <p className="mt-5 text-sm text-text-muted">Chưa có đơn hàng.</p> : null}
        <div className="mt-4 divide-y divide-border">
          {orders.map((order) => (
            <article key={order.id} className="space-y-4 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-text">{order.orderCode}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {order.items.length} sản phẩm · {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <label className="text-sm text-text-muted">Trạng thái
                  <select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)} className="ml-2 h-10 rounded-lg border border-border bg-surface px-3 text-text">
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
              </div>
              <ul className="divide-y divide-border rounded-lg bg-surface-muted px-4">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <span className="font-medium text-text">
                      {item.productName} <span className="text-text-muted">× {item.quantity}</span>
                    </span>
                    <span className="text-text-muted">{formatCurrency(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
