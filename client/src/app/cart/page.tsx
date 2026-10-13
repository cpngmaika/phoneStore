"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { createOrder } from "@/api/orders.service";
import { useCart } from "@/hooks/cart.hooks";

export default function CartPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const items = cart.items.map((item) => ({
      productId: Number(item.product.id),
      quantity: item.quantity,
    }));
    if (items.some((item) => !Number.isSafeInteger(item.productId))) {
      setError("Một số sản phẩm không có ID hợp lệ để đặt hàng.");
      return;
    }

    setPlacingOrder(true);
    try {
      const order = await createOrder({
        items,
        ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
      });
      clearCart();
      router.push(`/checkout/qr?orderId=${order.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tạo đơn hàng.",
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-primary">Giỏ hàng</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Sản phẩm của bạn</h1>
        </div>
        {cart.items.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-text-muted">Giỏ hàng đang trống.</p>
            <Link href="/" className="mt-4 inline-flex font-semibold text-primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <form
              id="create-order"
              onSubmit={placeOrder}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <label htmlFor="coupon" className="text-sm font-semibold text-text">
                Mã giảm giá (không bắt buộc)
              </label>
              <input
                id="coupon"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
                placeholder="Nhập mã giảm giá"
              />
              {error ? (
                <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>
              ) : null}
              <button type="submit" className="sr-only">Xác nhận đặt hàng</button>
            </form>
          </>
        )}
      </section>
      <CartSummary
        placingOrder={placingOrder}
      />
    </main>
  );
}
