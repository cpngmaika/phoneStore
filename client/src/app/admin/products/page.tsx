"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getBrands } from "@/api/brands.service";
import { createProduct, deleteProduct, getProducts } from "@/api/products.service";
import { formatCurrency } from "@/lib/product.utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiBrand } from "@/types/brand.types";
import type { ProductRequest } from "@/types/product.types";
import type { Product } from "@/types/product.types";

export default function AdminProductsPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadProducts = useCallback(async () => {
    setProducts(await getProducts());
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    Promise.all([getProducts(), getBrands()])
      .then(([loadedProducts, loadedBrands]) => {
        if (!cancelled) {
          setProducts(loadedProducts);
          setBrands(loadedBrands);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải dữ liệu.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const payload: ProductRequest = {
        sku: String(data.get("sku")),
        name: String(data.get("name")),
        description: String(data.get("description")),
        price: Number(data.get("price")),
        category: String(data.get("category")) as ProductRequest["category"],
        status: "IN_STOCK",
        brandId: Number(data.get("brandId")),
        imageUrls: String(data.get("imageUrl")).trim() ? [String(data.get("imageUrl")).trim()] : [],
      };
      await createProduct(payload);
      event.currentTarget.reset();
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể thêm sản phẩm.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(id: string) {
    setError(null);
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể xóa sản phẩm.");
    }
  }

  if (checkingUser) return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  if (user?.role !== "ADMIN") return <main className="mx-auto max-w-6xl px-5 py-16"><p role="alert" className="text-red-700">Bạn cần quyền quản trị.</p><Link href="/login" className="text-primary">Đăng nhập</Link></main>;

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div><Link href="/admin" className="text-sm font-semibold text-primary">← Quản trị</Link><h1 className="mt-3 text-3xl font-semibold text-text">Sản phẩm</h1></div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <form onSubmit={addProduct} className="grid gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="font-semibold text-text sm:col-span-2 lg:col-span-3">Thêm sản phẩm</h2>
        <input name="sku" required placeholder="SKU" className="h-10 rounded-lg border border-border px-3" />
        <input name="name" required placeholder="Tên sản phẩm" className="h-10 rounded-lg border border-border px-3" />
        <input name="price" required type="number" min="0" step="0.01" placeholder="Giá" className="h-10 rounded-lg border border-border px-3" />
        <select name="category" className="h-10 rounded-lg border border-border px-3">{["SMARTPHONE", "TABLET", "EARPHONE", "CHARGER", "CABLE", "CASE"].map((category) => <option key={category} value={category}>{category}</option>)}</select>
        <select name="brandId" required className="h-10 rounded-lg border border-border px-3"><option value="">Chọn thương hiệu</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select>
        <input name="imageUrl" type="url" placeholder="URL ảnh (tùy chọn)" className="h-10 rounded-lg border border-border px-3" />
        <textarea name="description" required placeholder="Mô tả sản phẩm" className="min-h-20 rounded-lg border border-border p-3 sm:col-span-2 lg:col-span-3" />
        <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Thêm sản phẩm</button>
      </form>
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        {loadingProducts ? <p role="status" className="p-5 text-sm text-text-muted">Đang tải sản phẩm...</p> : products.map((product) => (
          <article key={product.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
            <div><p className="font-semibold text-text">{product.name}</p><p className="mt-1 text-sm text-text-muted">{product.sku} · {product.category} · {product.brand.name}</p></div>
            <div className="flex items-center gap-4"><span className="font-semibold text-text">{formatCurrency(product.price)}</span><button type="button" onClick={() => removeProduct(product.id)} className="text-sm font-semibold text-primary">Xóa</button></div>
          </article>
        ))}
      </section>
    </main>
  );
}
