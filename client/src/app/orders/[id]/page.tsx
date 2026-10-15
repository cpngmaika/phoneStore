"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderById } from "@/api/orders.service";
import { apiClient } from "@/api/client";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { formatCurrency } from "@/lib/product.utils";
import { formatDateTime, orderStatusLabel } from "@/lib/order.utils";
import type { ApiOrder } from "@/types/order.types";

type PaymentCheck = { status?: string; data?: { status?: string } };

function paymentStatusLabel(status: string | null): string {
  if (status === "SUCCESS") return "Đã thanh toán";
  if (status === "PENDING") return "Chờ thanh toán";
  return "Chưa có giao dịch";
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrderById(id)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không tìm thấy đơn hàng.",
          );
        }
      });

    apiClient<PaymentCheck>(`/api/payment/check?orderId=${id}`)
      .then((response) => {
        if (cancelled) return;
        const payment = response?.data ?? response;
        setPaymentStatus(payment?.status ?? null);
      })
      .catch(() => {
        if (!cancelled) setPaymentStatus(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <p role="alert" className="text-red-700">
          {error}
        </p>
        <Link href="/orders" className="mt-4 inline-block text-primary">
          Quay lại đơn hàng
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-text-muted" role="status">
        Đang tải đơn hàng...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-5 py-10 sm:px-8">
      <div className="grid gap-6 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Đơn hàng
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-text">
            {order.orderCode}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {formatDateTime(order.orderDate) || "—"}
          </p>
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-text-muted">
              Trạng thái:{" "}
              <span className="font-semibold text-text">
                {orderStatusLabel(order.status)}
              </span>
            </p>
            <p className="text-text-muted">
              Thanh toán:{" "}
              <span className="font-semibold text-text">
                {paymentStatusLabel(paymentStatus)}
              </span>
            </p>
          </div>
          {order.status === "PENDING" ? (
            <Link
              href={`/checkout/qr?orderId=${order.id}`}
              className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Thanh toán chuyển khoản QR
            </Link>
          ) : null}
        </div>
        <div className="sm:justify-self-end">
          <OrderTimeline status={order.status} />
        </div>
      </div>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text">Sản phẩm trong đơn</h2>
        <div className="mt-4 divide-y divide-border">
          {order.items.map((item) => {
            const imageUrl = item.imageUrl ?? item.images?.[0] ?? null;
            return (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4 text-sm"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.productName}
                      fill
                      unoptimized={imageUrl.includes("/api/product-images/")}
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-text-muted">
                      —
                    </div>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text">{item.productName}</p>
                    <p className="mt-1 text-text-muted">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-text">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {order.couponCode ? (
          <p className="mt-3 text-sm text-text-muted">
            Mã giảm giá: {order.couponCode}
          </p>
        ) : null}
        <p className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold text-text">
          <span>Tổng cộng</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </p>
      </section>

      <Link href="/orders" className="inline-flex font-semibold text-primary">
        Xem tất cả đơn hàng
      </Link>
    </main>
  );
}
