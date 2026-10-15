import Link from "next/link";
import { formatCurrency } from "@/lib/product.utils";
import { PaymentPoller } from "@/components/checkout/PaymentPoller";
import type { ApiOrder, ApiPayment } from "@/types/order.types";

type PaymentOrderSummaryProps = {
  order: ApiOrder;
  payment: ApiPayment | null;
  onRefresh: () => Promise<void>;
};

export function PaymentOrderSummary({
  order,
  payment,
  onRefresh,
}: PaymentOrderSummaryProps) {
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
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700">
            Chờ thanh toán ({order.status})
          </div>
        </div>
        <p className="mt-2 text-sm text-text-muted">
          Mã đơn hàng: <span className="font-semibold text-text">{order.orderCode}</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
            {payment?.qrUrl ? (
              <div className="mx-auto mb-4 flex max-w-[260px] justify-center rounded-xl border border-border bg-white p-3">
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
                <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 font-mono font-bold text-red-600">
                  {payment?.paymentCode || order.orderCode}
                </span>
              </div>
            </div>
            <PaymentPoller
              orderId={order.id}
              initialStatus={payment?.status ?? order.status}
              onRefresh={onRefresh}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-text">Sản phẩm trong đơn</h2>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item) => {
                const itemImg = item.imageUrl || item.images?.[0];
                return (
                  <div key={item.productId} className="flex items-center gap-4 py-4 text-sm">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-soft">
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
                      <p className="truncate font-semibold text-text">{item.productName}</p>
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
          <div className="flex items-center justify-between text-sm">
            <Link href="/orders" className="inline-flex font-semibold text-primary hover:underline">
              ← Xem tất cả đơn hàng
            </Link>
            <Link href="/" className="text-text-muted hover:text-text hover:underline">
              Tiếp tục mua hàng
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
