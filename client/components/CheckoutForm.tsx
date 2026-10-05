export function CheckoutForm() {
  return (
    <form className="rounded-lg border border-border bg-surface p-6">
      <div>
        <p className="text-sm font-semibold text-primary">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-text">
          Delivery information
        </h1>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-text">
          First name
          <input
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="Alex"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-text">
          Last name
          <input
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="Morgan"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-text sm:col-span-2">
          Email
          <input
            type="email"
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="alex@example.com"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-text sm:col-span-2">
          Address
          <input
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="123 Market Street"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-text">
          City
          <input
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="San Francisco"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-text">
          ZIP code
          <input
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 font-normal outline-none transition focus:border-primary"
            placeholder="94103"
          />
        </label>
      </div>

      <div className="mt-8 rounded-lg bg-primary-soft p-5">
        <h2 className="font-semibold text-text">Delivery method</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-primary bg-surface p-4">
            <input defaultChecked type="radio" name="delivery" className="accent-primary" />
            <span className="text-sm font-semibold text-text">Standard</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-4">
            <input type="radio" name="delivery" className="accent-primary" />
            <span className="text-sm font-semibold text-text">Express</span>
          </label>
        </div>
      </div>
    </form>
  );
}
