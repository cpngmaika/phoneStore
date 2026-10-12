import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export default function CartPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)] lg:py-12">
      <section className="space-y-6">
        <CheckoutForm />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-primary">Your cart</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-text">
            Items and total
          </h2>
        </div>
        <CartList />
        <CartSummary />
      </section>
    </main>
  );
}
