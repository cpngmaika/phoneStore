"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/products/FilterBar";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product, ProductCategory } from "@/types/product.types";

export function ProductList({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<"ALL" | ProductCategory>("ALL");
  const [brand, setBrand] = useState("ALL");
  const [price, setPrice] = useState("ALL");

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand.name))),
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "ALL" || product.category === category;
    const matchesBrand = brand === "ALL" || product.brand.name === brand;
    const matchesPrice =
      price === "ALL" ||
      (price === "UNDER_250" && product.price < 250) ||
      (price === "250_800" && product.price >= 250 && product.price <= 800) ||
      (price === "OVER_800" && product.price > 800);

    return matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <>
      <FilterBar
        brands={brands}
        selectedCategory={category}
        selectedBrand={brand}
        selectedPrice={price}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onPriceChange={setPrice}
      />

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              {filteredProducts.length} products
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-text sm:text-4xl">
              Find your next device
            </h1>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
