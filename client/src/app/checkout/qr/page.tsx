"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/api/orders.service";
import { apiClient } from "@/api/client";
import { PaymentOrderSummary } from "@/components/checkout/PaymentOrderSummary";
import { PaymentStatusView } from "@/components/checkout/PaymentStatusView";
import { Loading } from "@/components/ui/Loading";
import type { ApiOrder, ApiPayment } from "@/types/order.types";

// The Java payment endpoints return the PaymentResponse directly, but some
// responses may still be wrapped in the ApiResponse envelope. Support both.
type PaymentApiShape = ApiPayment & { data?: ApiPayment };

async function fetchPaymentData(orderId: string | number): Promise<ApiPayment | null> {
  try {
    const res = await apiClient<PaymentApiShape>(
      `/api/payment/create?orderId=${orderId}`,
      { method: "POST" },
    );
    if (res) {
      return res.data ?? res;
    }
  } catch (err) {
    console.warn("Lỗi khi tạo payment, thử gọi fallback check:", err);
  }

  try {
    const checkRes = await apiClient<PaymentApiShape>(
      `/api/payment/check?orderId=${orderId}`,
    );
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  if (loading) {
    return <PaymentStatusView state="loading" />;
  }

  if (!orderId) {
    return <PaymentStatusView state="missing" />;
  }

  if (isUnauthorized) {
    return <PaymentStatusView state="unauthorized" orderId={orderId} />;
  }

  if (error || !order) {
    return <PaymentStatusView state="error" orderId={orderId} />;
  }

  const isPaid = order.status === "CONFIRMED" || payment?.status === "SUCCESS";
  const isCancelled = order.status === "CANCELLED";

  if (isPaid) {
    return <PaymentStatusView state="paid" order={order} />;
  }

  if (isCancelled) {
    return <PaymentStatusView state="cancelled" order={order} />;
  }

  return <PaymentOrderSummary order={order} payment={payment} onRefresh={loadData} />;
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
