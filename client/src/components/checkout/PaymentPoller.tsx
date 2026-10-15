"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/Button";
import type { ApiPayment } from "@/types/order.types";

type PaymentPollerProps = {
  orderId: number;
  initialStatus: string;
  onRefresh?: () => void | Promise<void>;
};

export function PaymentPoller({ orderId, initialStatus, onRefresh }: PaymentPollerProps) {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (initialStatus === "CONFIRMED" || initialStatus === "SUCCESS") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await apiClient<ApiPayment & { data?: ApiPayment }>(
          `/api/payment/check?orderId=${orderId}`,
        );
        const payment = res?.data ?? res;
        if (payment?.status === "SUCCESS") {
          onRefresh?.();
        }
      } catch {
        // Polling error ignored
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId, initialStatus, onRefresh]);

  async function checkManual() {
    setChecking(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setTimeout(() => setChecking(false), 600);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      <Button
        onClick={checkManual}
        disabled={checking}
        variant="primary"
        className="w-full sm:w-auto"
      >
        {checking ? "Đang kiểm tra..." : "Làm mới trạng thái"}
      </Button>
    </div>
  );
}
