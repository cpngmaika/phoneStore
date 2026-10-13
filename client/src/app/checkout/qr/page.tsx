"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/api/orders.service";
import { apiClient } from "@/api/client";
import { formatCurrency } from "@/lib/product.utils";
import { PaymentPoller } from "@/components/checkout/PaymentPoller";
import { Loading } from "@/components/ui/Loading";
import type { ApiOrder, ApiPayment } from "@/types/order.types";

async function fetchPaymentData(orderId: string | number): Promise<ApiPayment | null> {
  try {
    const res = await apiClient<any>(`/api/payment/create?orderId=${orderId}`, {
      method: "POST",
    });
    if (res) {
      return res.data ?? res;
    }
  } catch (err) {
    console.warn("Lỗi khi tạo payment, thử gọi fallback check:", err);
  }

  try {
    const checkRes = await apiClient<any>(`/api/payment/check?orderId=${orderId}`);
    if (checkRes) {
      return checkRes.data ?? checkRes;
    }
  } catch (err) {
    console.error("Lỗi khi gọi endpoint payment check:", err);
  }

  return null;
}

function QrPaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")?.trim() || "";

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [payment, setPayment] = useState<ApiPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadData = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
      setIsUnauthorized(false);
      setError(null);

      const paymentData = await fetchPaymentData(orderId);
      setPayment(paymentData);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Không thể lấy thông tin đơn hàng.";

      if (
        message.includes("401") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("login") ||
        message.toLowerCase().includes("đăng nhập")
      ) {
        setIsUnauthorized(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 shadow-soft">
          <Loading label="Đang tải thông tin đơn hàng và thanh toán..." />
        </div>
      </main>
    );
  }

  if (!orderId) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-text">Thiếu mã đơn hàng</p>
          <p className="mt-2 text-sm text-text-muted">
            Vui lòng cung cấp mã đơn hàng hợp lệ trên đường dẫn.
          </p>
          <Link
            href="/cart"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
      </main>
    );
  }

  if (isUnauthorized) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-text">Yêu cầu đăng nhập</p>
          <p className="mt-2 text-sm text-text-muted">
            Vui lòng đăng nhập để xem thông tin thanh toán của đơn hàng này.
          </p>
          <Link
            href={`/login?redirect=/checkout/qr?orderId=${orderId}`}
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-red-600">Đơn hàng không tồn tại</p>
          <p className="mt-2 text-sm text-text-muted">
            Đơn hàng #{orderId} không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/orders"
              className="inline-flex rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text hover:border-border-strong"
            >
              Xem đơn hàng của bạn
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isPaid = order.status === "CONFIRMED" || payment?.status === "SUCCESS";
  const isCancelled = order.status === "CANCELLED";

  if (isPaid) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-green-200 bg-surface p-8 shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text">
            Thanh toán thành công!
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Đơn hàng <span className="font-semibold text-text">{order.orderCode}</span> đã được thanh toán thành công và xác nhận trên hệ thống.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-bg-soft p-4 text-left text-sm">
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Số tiền đã thanh toán:</span>
              <span className="font-semibold text-text">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Trạng thái:</span>
              <span className="font-semibold text-green-600">CONFIRMED</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Xem chi tiết đơn hàng
            </Link>
            <Link
              href="/orders"
              className="inline-flex rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text hover:border-border-strong"
            >
              Danh sách đơn hàng
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isCancelled) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-red-200 bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-red-600">Đơn hàng đã bị hủy</p>
          <p className="mt-2 text-sm text-text-muted">
            Đơn hàng #{order.orderCode} hiện đang ở trạng thái CANCELLED.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Thanh toán đơn hàng</p>
            <h1 className="mt-1 text-2xl font-bold text-text sm:text-3xl">
              Quét mã QR để thanh toán
            </h1>
          </div>
          <div className="rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            Chờ thanh toán ({order.status})
          </div>
        </div>
        <p className="mt-2 text-sm text-text-muted">
          Mã đơn hàng: <span className="font-semibold text-text">{order.orderCode}</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        {/* Left column: QR Code & Transfer Details */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft text-center">
            {payment?.qrUrl ? (
              <div className="mx-auto mb-4 flex justify-center rounded-xl bg-white p-3 border border-border max-w-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payment.qrUrl}
                  alt="Mã QR thanh toán"
                  className="h-[230px] w-[230px] rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-border bg-bg-soft text-sm text-text-muted">
                Đang chuẩn bị mã QR...
              </div>
            )}

            <p className="text-xs text-text-muted">
              Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã thanh toán.
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-border bg-bg-soft p-4 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Số tiền cần trả:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(payment?.amount ?? order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-text-muted">Nội dung CK:</span>
                <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  {payment?.paymentCode || order.orderCode}
                </span>
              </div>
            </div>

            <PaymentPoller
              orderId={order.id}
              initialStatus={payment?.status ?? order.status}
              onRefresh={loadData}
            />
          </div>
        </section>

        {/* Right column: Order Items & Summary */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-text">Sản phẩm trong đơn</h2>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item) => {
                const itemImg = item.imageUrl || item.images?.[0];
                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 py-4 text-sm"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-soft flex items-center justify-center">
                      {itemImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={itemImg}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-text-muted">No img</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        Số lượng: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-text">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              {order.couponCode ? (
                <div className="flex justify-between text-text-muted">
                  <span>Mã giảm giá đã áp dụng:</span>
                  <span className="font-semibold text-primary">{order.couponCode}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-text">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link
              href="/orders"
              className="inline-flex font-semibold text-primary hover:underline"
            >
              ← Xem tất cả đơn hàng
            </Link>
            <Link
              href="/"
              className="text-text-muted hover:text-text hover:underline"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function QrPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-5 py-24 text-center">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 shadow-soft">
            <Loading label="Đang tải..." />
          </div>
        </main>
      }
    >
      <QrPaymentContent />
    </Suspense>
  );
}
