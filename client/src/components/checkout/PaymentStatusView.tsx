import Link from "next/link";
import { Loading } from "@/components/ui/Loading";
import { formatCurrency } from "@/lib/product.utils";
import type { ApiOrder } from "@/types/order.types";

type PaymentStatusViewProps =
  | { state: "loading" }
  | { state: "missing" }
  | { state: "unauthorized"; orderId: string }
  | { state: "error"; orderId: string }
  | { state: "paid"; order: ApiOrder }
  | { state: "cancelled"; order: ApiOrder };

export function PaymentStatusView(props: PaymentStatusViewProps) {
  if (props.state === "loading") {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 shadow-soft">
          <Loading label="Đang tải thông tin đơn hàng và thanh toán..." />
        </div>
      </main>
    );
  }

  if (props.state === "missing") {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-text">Thiếu mã đơn hàng</p>
          <p className="mt-2 text-sm text-text-muted">
            Vui lòng cung cấp mã đơn hàng hợp lệ trên đường dẫn.
          </p>
          <Link href="/cart" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            Quay lại giỏ hàng
          </Link>
        </div>
      </main>
    );
  }

  if (props.state === "unauthorized") {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-text">Yêu cầu đăng nhập</p>
          <p className="mt-2 text-sm text-text-muted">
            Vui lòng đăng nhập để xem thông tin thanh toán của đơn hàng này.
          </p>
          <Link href={`/login?redirect=/checkout/qr?orderId=${props.orderId}`} className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            Đăng nhập ngay
          </Link>
        </div>
      </main>
    );
  }

  if (props.state === "error") {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-lg font-semibold text-red-600">Đơn hàng không tồn tại</p>
          <p className="mt-2 text-sm text-text-muted">
            Đơn hàng #{props.orderId} không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/orders" className="inline-flex rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text hover:border-border-strong">
              Xem đơn hàng của bạn
            </Link>
            <Link href="/" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (props.state === "paid") {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 text-center">
        <div className="rounded-2xl border border-green-200 bg-surface p-8 shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text">Thanh toán thành công!</h1>
          <p className="mt-2 text-sm text-text-muted">
            Đơn hàng <span className="font-semibold text-text">{props.order.orderCode}</span> đã được thanh toán thành công và xác nhận trên hệ thống.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-bg-soft p-4 text-left text-sm">
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Số tiền đã thanh toán:</span>
              <span className="font-semibold text-text">{formatCurrency(props.order.totalAmount)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Trạng thái:</span>
              <span className="font-semibold text-green-600">CONFIRMED</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Link href={`/orders/${props.order.id}`} className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              Xem chi tiết đơn hàng
            </Link>
            <Link href="/orders" className="inline-flex rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text hover:border-border-strong">
              Danh sách đơn hàng
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center">
      <div className="rounded-2xl border border-red-200 bg-surface p-8 shadow-soft">
        <p className="text-lg font-semibold text-red-600">Đơn hàng đã bị hủy</p>
        <p className="mt-2 text-sm text-text-muted">
          Đơn hàng #{props.order.orderCode} hiện đang ở trạng thái CANCELLED.
        </p>
        <Link href="/orders" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    </main>
  );
}
