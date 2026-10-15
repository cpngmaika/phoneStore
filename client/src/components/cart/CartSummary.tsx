"use client";

import { formatCurrency } from "@/lib/product.utils";
import { useCart } from "@/hooks/cart.hooks";
import { Button } from "@/components/ui/Button";

type CartSummaryProps = {
  placingOrder: boolean;
  discountAmount?: number;
  finalTotal?: number;
};

export function CartSummary({
  placingOrder,
  discountAmount = 0,
  finalTotal,
}: CartSummaryProps) {
  const { cart } = useCart();
  const total = finalTotal ?? cart.total;

  return (
    <aside className="rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-32">
      <h2 className="text-xl font-semibold text-text">Tóm tắt đơn hàng</h2>
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Tạm tính</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
        {discountAmount > 0 ? (
          <div className="flex justify-between text-primary">
            <span>Giảm giá</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg font-semibold text-text">
        <span>Tổng cộng</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <Button
        type="submit"
        form="create-order"
        disabled={cart.items.length === 0 || placingOrder}
        className="mt-6 h-12 w-full rounded-lg bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placingOrder ? "Đang tạo đơn..." : "Đặt hàng"}
      </Button>
      <p className="mt-4 text-sm leading-6 text-text-muted">
        Đơn hàng sẽ được tạo trên hệ thống. Phương thức thanh toán không nằm
        trong luồng đặt hàng này.
      </p>
    </aside>
  );
}
