import { titleCase } from "@/lib/product.utils";
import type { Product } from "@/types/product.types";

export function ProductSpecs({ product }: { product: Product }) {
  const specs: Array<[string, string | undefined]> =
    product.category === "SMARTPHONE" || product.category === "TABLET"
      ? [
          ["Chipset", product.chipset],
          ["Storage", product.storageGb === undefined ? undefined : `${product.storageGb} GB`],
          ["Screen", product.screenSize === undefined ? undefined : `${product.screenSize}"`],
          ["Battery", product.batteryMah === undefined ? undefined : `${product.batteryMah} mAh`],
          ["OS", product.os],
          ["Color", product.color],
        ]
      : product.category === "EARPHONE"
        ? [
            ["Connection", product.connectionType],
            ["ANC", product.hasANC === undefined ? undefined : product.hasANC ? "Yes" : "No"],
            ["Battery life", product.batteryLifeHours === undefined ? undefined : `${product.batteryLifeHours} hours`],
            ["Wireless", product.isWireless === undefined ? undefined : product.isWireless ? "Yes" : "No"],
          ]
        : "lengthMeters" in product
          ? [
              ["Length", product.lengthMeters === undefined ? undefined : product.lengthMeters ? `${product.lengthMeters} m` : "Wall plug"],
              ["Wattage", product.wattageW === undefined ? undefined : `${product.wattageW} W`],
              ["Fast charge", product.isFastCharge === undefined ? undefined : product.isFastCharge ? "Yes" : "No"],
            ]
          : [];
  const availableSpecs = specs.filter(
    (spec): spec is [string, string] => Boolean(spec[1]),
  );

  if (availableSpecs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Specifications</h2>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          {titleCase(product.category)}
        </span>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {availableSpecs.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-surface-muted p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
