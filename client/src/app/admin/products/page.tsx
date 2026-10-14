"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getApiOrigin } from "@/api/client";
import {
  getBrands,
} from "@/api/brands.service";
import {
  createProduct,
  deleteProduct,
  getProductImageStoragePath,
  getProducts,
  updateProduct,
} from "@/api/products.service";
import { getWarrantyPolicies } from "@/api/warranty-policies.service";
import { formatCurrency } from "@/lib/product.utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiBrand } from "@/types/brand.types";
import type { Product, ProductCategory, ProductRequest } from "@/types/product.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

type SpecField = {
  name: keyof ProductRequest;
  label: string;
  type: "text" | "number" | "boolean";
};

const categories: ProductCategory[] = [
  "SMARTPHONE",
  "TABLET",
  "EARPHONE",
  "CHARGER",
  "CABLE",
  "CASE",
];

const specFields: Record<ProductCategory, SpecField[]> = {
  SMARTPHONE: [
    { name: "chipset", label: "Chipset", type: "text" },
    { name: "storageGb", label: "Bộ nhớ (GB)", type: "number" },
    { name: "screenSize", label: "Kích thước màn hình (inch)", type: "number" },
    { name: "screenTech", label: "Công nghệ màn hình", type: "text" },
    { name: "batteryMah", label: "Pin (mAh)", type: "number" },
    { name: "mainCameraMp", label: "Camera chính (MP)", type: "number" },
    { name: "os", label: "Hệ điều hành", type: "text" },
    { name: "color", label: "Màu sắc", type: "text" },
    { name: "supports5G", label: "Hỗ trợ 5G", type: "boolean" },
  ],
  TABLET: [
    { name: "chipset", label: "Chipset", type: "text" },
    { name: "storageGb", label: "Bộ nhớ (GB)", type: "number" },
    { name: "screenSize", label: "Kích thước màn hình (inch)", type: "number" },
    { name: "batteryMah", label: "Pin (mAh)", type: "number" },
    { name: "os", label: "Hệ điều hành", type: "text" },
    { name: "color", label: "Màu sắc", type: "text" },
    { name: "hasCellular", label: "Có kết nối di động", type: "boolean" },
  ],
  EARPHONE: [
    { name: "connectionType", label: "Kiểu kết nối", type: "text" },
    { name: "hasANC", label: "Chống ồn chủ động (ANC)", type: "boolean" },
    { name: "batteryLifeHours", label: "Thời lượng pin (giờ)", type: "number" },
  ],
  CHARGER: [
    { name: "wattage", label: "Công suất (W)", type: "number" },
    { name: "portType", label: "Loại cổng", type: "text" },
    { name: "fastChargingTech", label: "Công nghệ sạc nhanh", type: "text" },
  ],
  CABLE: [
    { name: "lengthMeters", label: "Chiều dài (m)", type: "number" },
    { name: "connectorFrom", label: "Đầu kết nối 1", type: "text" },
    { name: "connectorTo", label: "Đầu kết nối 2", type: "text" },
  ],
  CASE: [
    { name: "material", label: "Chất liệu", type: "text" },
    { name: "color", label: "Màu sắc", type: "text" },
    { name: "compatibleModel", label: "Thiết bị tương thích", type: "text" },
  ],
};

function productFormValues(product: Product): Partial<ProductRequest> {
  const base = {
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    status:
      product.status === "ACTIVE"
        ? "IN_STOCK"
        : product.status === "HIDDEN"
          ? "DISCONTINUED"
          : "OUT_OF_STOCK",
    brandId: Number(product.brand.id),
    warrantyPolicyId: product.warrantyPolicyId
      ? Number(product.warrantyPolicyId)
      : null,
    imageUrls: product.images.map((image) =>
      getProductImageStoragePath(image.imageUrl),
    ),
  } satisfies Partial<ProductRequest>;

  switch (product.category) {
    case "SMARTPHONE":
      return {
        ...base,
        chipset: product.chipset,
        storageGb: product.storageGb,
        screenSize: product.screenSize,
        screenTech: product.screenTech,
        batteryMah: product.batteryMah,
        mainCameraMp: product.mainCameraMp,
        os: product.os,
        color: product.color,
        supports5G: product.supports5G,
      };
    case "TABLET":
      return {
        ...base,
        chipset: product.chipset,
        storageGb: product.storageGb,
        screenSize: product.screenSize,
        batteryMah: product.batteryMah,
        os: product.os,
        color: product.color,
        hasCellular: product.hasCellular,
      };
    case "EARPHONE":
      return {
        ...base,
        connectionType: product.connectionType,
        hasANC: product.hasANC,
        batteryLifeHours: product.batteryLifeHours,
      };
    case "CHARGER":
      return {
        ...base,
        wattage: product.wattageW,
        portType: product.portType,
        fastChargingTech: product.fastChargingTech,
      };
    case "CABLE":
      return {
        ...base,
        lengthMeters: product.lengthMeters,
        connectorFrom: product.connectorFrom,
        connectorTo: product.connectorTo,
      };
    case "CASE":
      return {
        ...base,
        material: product.material,
        color: product.color,
        compatibleModel: product.compatibleModel,
      };
  }
}

export default function AdminProductsPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [warrantyPolicies, setWarrantyPolicies] = useState<WarrantyPolicy[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory>("SMARTPHONE");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const loadProducts = useCallback(async () => {
    setProducts(await getProducts());
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    Promise.all([getProducts(), getBrands(), getWarrantyPolicies()])
      .then(([loadedProducts, loadedBrands, loadedPolicies]) => {
        if (!cancelled) {
          setProducts(loadedProducts);
          setBrands(loadedBrands);
          setWarrantyPolicies(loadedPolicies);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Không thể tải dữ liệu.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      const imageFiles = data
        .getAll("images")
        .filter((value): value is File => value instanceof File && value.size > 0);
      const invalidImage = imageFiles.find((file) => file.size > 5 * 1024 * 1024);
      if (invalidImage) {
        throw new Error("Mỗi ảnh tải lên không được vượt quá 5 MB.");
      }
      if (imageUrls.length + imageFiles.length > 8) {
        throw new Error("Mỗi sản phẩm được lưu tối đa 8 ảnh.");
      }
      const payload: ProductRequest = {
        sku: String(data.get("sku")).trim(),
        name: String(data.get("name")).trim(),
        description: String(data.get("description")).trim(),
        price: Number(data.get("price")),
        category,
        status: String(data.get("status")) as ProductRequest["status"],
        brandId: Number(data.get("brandId")),
        warrantyPolicyId: data.get("warrantyPolicyId")
          ? Number(data.get("warrantyPolicyId"))
          : null,
        clearWarrantyPolicy: Boolean(editingProduct) && !data.get("warrantyPolicyId"),
        imageUrls,
      };
      for (const field of specFields[category]) {
        const value = data.get(String(field.name));
        if (value === null || value === "") continue;
        if (field.type === "boolean") {
          Object.assign(payload, { [field.name]: value === "true" });
        } else if (field.type === "number") {
          Object.assign(payload, { [field.name]: Number(value) });
        } else {
          Object.assign(payload, { [field.name]: String(value).trim() });
        }
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload, imageFiles);
      } else {
        await createProduct(payload, imageFiles);
      }
      setEditingProduct(null);
      setCategory("SMARTPHONE");
      setImageUrls([]);
      form.reset();
      await loadProducts();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể lưu sản phẩm.");
    } finally {
      setBusy(false);
    }
  }

  function startEditing(product: Product) {
    setEditingProduct(product);
    setCategory(product.category);
    setImageUrls(product.images.map((image) => getProductImageStoragePath(image.imageUrl)));
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setError(null);
    setDeletingProductId(id);
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      if (editingProduct?.id === id) {
        setEditingProduct(null);
        setImageUrls([]);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể xóa sản phẩm.");
    } finally {
      setDeletingProductId(null);
    }
  }

  if (checkingUser) return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  if (user?.role !== "ADMIN") return <main className="mx-auto max-w-6xl px-5 py-16"><p role="alert" className="text-red-700">Bạn cần quyền quản trị.</p><Link href="/login" className="text-primary">Đăng nhập</Link></main>;

  const values = editingProduct ? productFormValues(editingProduct) : {};
  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-primary">← Quản trị</Link>
        <h1 className="mt-3 text-3xl font-semibold text-text">Quản lý sản phẩm</h1>
      </div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      <form
        key={editingProduct?.id ?? "new-product"}
        onSubmit={saveProduct}
        className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <h2 className="font-semibold text-text sm:col-span-2 lg:col-span-3">
          {editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : "Thêm sản phẩm"}
        </h2>
        <label className="space-y-1 text-sm font-medium text-text">SKU
          <input name="sku" required defaultValue={values.sku} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Tên sản phẩm
          <input name="name" required defaultValue={values.name} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Giá
          <input name="price" required type="number" min="0" step="0.01" defaultValue={values.price} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Danh mục
          <select
            name="category"
            value={category}
            disabled={Boolean(editingProduct)}
            onChange={(event) => setCategory(event.target.value as ProductCategory)}
            className="h-10 w-full rounded-lg border border-border px-3"
          >
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Thương hiệu
          <select name="brandId" required defaultValue={values.brandId ?? ""} className="h-10 w-full rounded-lg border border-border px-3">
            <option value="">Chọn thương hiệu</option>
            {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Bảo hành
          <select name="warrantyPolicyId" defaultValue={values.warrantyPolicyId ?? ""} className="h-10 w-full rounded-lg border border-border px-3">
            <option value="">Không áp dụng</option>
            {warrantyPolicies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name} ({policy.durationMonths} tháng)</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-text">Trạng thái
          <select name="status" defaultValue={values.status ?? "IN_STOCK"} className="h-10 w-full rounded-lg border border-border px-3">
            <option value="IN_STOCK">Đang bán</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
            <option value="DISCONTINUED">Ngừng kinh doanh</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-text sm:col-span-2 lg:col-span-3">Mô tả
          <textarea name="description" required defaultValue={values.description} className="min-h-20 w-full rounded-lg border border-border p-3" />
        </label>

        <div key={category} className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {specFields[category].map((field) => {
            const value = values[field.name];
            if (field.type === "boolean") {
              return (
                <label key={field.name} className="space-y-1 text-sm font-medium text-text">{field.label}
                  <select
                    name={String(field.name)}
                    required={!editingProduct}
                    defaultValue={value === undefined ? "" : String(value)}
                    className="h-10 w-full rounded-lg border border-border px-3"
                  >
                    <option value="" disabled>Chọn</option>
                    <option value="true">Có</option>
                    <option value="false">Không</option>
                  </select>
                </label>
              );
            }
            return (
              <label key={field.name} className="space-y-1 text-sm font-medium text-text">{field.label}
                <input
                  name={String(field.name)}
                  required={!editingProduct}
                  type={field.type}
                  min={field.name === "screenSize" ? "0.01" : field.type === "number" ? "0" : undefined}
                  max={field.name === "screenSize" ? "100" : undefined}
                  step={field.name === "screenSize" || field.name === "batteryLifeHours" || field.name === "wattage" || field.name === "lengthMeters" ? "0.01" : undefined}
                  defaultValue={value === undefined ? "" : String(value)}
                  className="h-10 w-full rounded-lg border border-border px-3"
                />
              </label>
            );
          })}
        </div>

        <div className="space-y-3 text-sm font-medium text-text sm:col-span-2 lg:col-span-3">
          <p>Ảnh sản phẩm ({imageUrls.length}/8 ảnh hiện có)</p>
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {imageUrls.map((imageUrl) => (
                <div key={imageUrl} className="space-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
                    <Image
                      src={imageUrl.startsWith("/")
                        ? `${getApiOrigin()}${imageUrl}`
                        : imageUrl}
                      alt="Ảnh sản phẩm"
                      fill
                      unoptimized
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrls((current) => current.filter((url) => url !== imageUrl))}
                    className="text-sm font-semibold text-red-700"
                  >
                    Gỡ ảnh
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <label className="block space-y-1">
            <span>Chọn ảnh tải lên (JPEG, PNG, GIF, WebP; tối đa 5 MB/ảnh)</span>
            <input
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              disabled={imageUrls.length >= 8}
              className="block w-full rounded-lg border border-border p-3 text-sm"
            />
          </label>
        </div>
        <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
          <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Đang lưu..." : editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </button>
          {editingProduct ? (
            <button type="button" onClick={() => { setEditingProduct(null); setImageUrls([]); }} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
              Hủy chỉnh sửa
            </button>
          ) : null}
        </div>
      </form>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        {loadingProducts ? <p role="status" className="p-5 text-sm text-text-muted">Đang tải sản phẩm...</p> : products.map((product) => (
          <article key={product.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
            <div>
              <p className="font-semibold text-text">{product.name}</p>
              <p className="mt-1 text-sm text-text-muted">{product.sku} · {product.category} · {product.brand.name} · {product.images.length} ảnh</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-text">{formatCurrency(product.price)}</span>
              <button type="button" onClick={() => startEditing(product)} className="text-sm font-semibold text-primary">Sửa</button>
              <button type="button" disabled={deletingProductId === product.id} onClick={() => removeProduct(product.id)} className="text-sm font-semibold text-red-700 disabled:opacity-60">
                {deletingProductId === product.id ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
