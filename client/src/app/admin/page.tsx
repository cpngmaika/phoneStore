"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getAdminStats, updateOrderStatus } from "@/api/admin.service";
import { formatCurrency } from "@/lib/product.utils";
import { formatDateTime, orderStatusLabel } from "@/lib/order.utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AdminStats } from "@/types/admin.types";
import type { OrderStatus } from "@/types/order.types";

const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];

const navLinks = [
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/coupons", label: "Mã giảm giá" },
];

export default function AdminDashboardPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setStats(await getAdminStats());
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tải thống kê.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStats();
  }, [user, loadStats]);

  async function changeStatus(orderId: number, status: OrderStatus) {
    setError(null);
    try {
      await updateOrderStatus(orderId, status);
      await loadStats();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể cập nhật trạng thái.",
      );
    }
  }

  if (checkingUser) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p role="alert" className="text-red-700">
          Bạn cần quyền quản trị để xem trang này.
        </p>
        <Link href="/login" className="mt-4 inline-block text-primary">
          Đăng nhập
        </Link>
      </main>
    );
  }

  const cards = stats
    ? [
        { label: "Doanh thu (đã xác nhận)", value: formatCurrency(stats.totalRevenue) },
        { label: "Tổng đơn hàng", value: String(stats.totalOrders) },
        { label: "Chờ xác nhận", value: String(stats.pendingOrders) },
        { label: "Đã xác nhận", value: String(stats.confirmedOrders) },
        { label: "Người dùng", value: String(stats.totalUsers) },
        { label: "Sản phẩm đang bán", value: String(stats.productsInStock) },
      ]
    : [];

  const maxDailyRevenue = stats
    ? Math.max(1, ...stats.dailyRevenue.map((day) => day.revenue))
    : 1;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            PhoneStore
          </p>
          <h1 className="font-display mt-3 text-3xl text-text sm:text-4xl">
            Bảng điều khiển
          </h1>
        </div>
        <nav className="flex gap-2 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-border px-4 py-2 text-text transition hover:border-border-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p role="status" className="text-sm text-text-muted">
          Đang tải thống kê...
        </p>
      ) : stats ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {card.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-text">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-text">
                Doanh thu 7 ngày gần nhất
              </h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="text-text-muted">
                  Hôm nay:{" "}
                  <span className="font-semibold text-text">
                    {formatCurrency(stats.revenueToday)}
                  </span>
                </span>
                <span className="text-text-muted">
                  Tuần:{" "}
                  <span className="font-semibold text-text">
                    {formatCurrency(stats.revenueThisWeek)}
                  </span>
                </span>
                <span className="text-text-muted">
                  Tháng:{" "}
                  <span className="font-semibold text-text">
                    {formatCurrency(stats.revenueThisMonth)}
                  </span>
                </span>
              </div>
              <div className="mt-6 flex h-40 items-end gap-2">
                {stats.dailyRevenue.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end">
                      <div
                        className="w-full rounded-t bg-primary/80"
                        style={{
                          height: `${Math.round((day.revenue / maxDailyRevenue) * 100)}%`,
                          minHeight: day.revenue > 0 ? "3px" : "0",
                        }}
                        title={formatCurrency(day.revenue)}
                      />
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(day.date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-text">Bán chạy nhất</h2>
              {stats.bestSellers.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">
                  Chưa có dữ liệu bán hàng.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {stats.bestSellers.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <span className="font-medium text-text">
                        {item.productName}
                      </span>
                      <span className="shrink-0 text-text-muted">
                        {item.quantity} đã bán ·{" "}
                        {formatCurrency(item.revenue)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">
              Đơn hàng gần đây
            </h2>
            {stats.recentOrders.length === 0 ? (
              <p className="mt-4 text-sm text-text-muted">Chưa có đơn hàng.</p>
            ) : (
              <div className="mt-4 divide-y divide-border">
                {stats.recentOrders.map((order) => (
                  <article
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-semibold text-text hover:text-primary"
                      >
                        {order.orderCode}
                      </Link>
                      <p className="mt-1 text-sm text-text-muted">
                        {formatDateTime(order.orderDate)} ·{" "}
                        {order.items.length} sản phẩm ·{" "}
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                    <label className="text-sm text-text-muted">
                      Trạng thái
                      <select
                        value={order.status}
                        onChange={(event) =>
                          changeStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        className="ml-2 h-10 rounded-md border border-border bg-surface px-3 text-text"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {orderStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
