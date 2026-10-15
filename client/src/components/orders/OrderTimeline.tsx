import type { OrderStatus } from "@/types/order.types";

// Only statuses that exist in the backend: PENDING, CONFIRMED, CANCELLED.
const STEPS: Array<{ status: OrderStatus; label: string }> = [
  { status: "PENDING", label: "Đặt hàng" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        Đơn hàng đã bị huỷ.
      </div>
    );
  }

  const currentIndex = status === "CONFIRMED" ? 1 : 0;

  return (
    <ol className="space-y-2">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const isLast = index === STEPS.length - 1;
        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-text-muted"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              {!isLast ? (
                <span
                  className={`my-1 h-6 w-px ${
                    currentIndex > index ? "bg-primary" : "bg-border"
                  }`}
                />
              ) : null}
            </div>
            <p
              className={`pt-1 text-sm font-semibold ${
                done ? "text-text" : "text-text-muted"
              }`}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
