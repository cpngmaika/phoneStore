"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getApiOrigin } from "@/api/client";
import { getProductImageStoragePath } from "@/api/products.service";
import type { ApiBrand } from "@/types/brand.types";
import type {
  Product,
  ProductCategory,
  ProductRequest,
} from "@/types/product.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

export type SpecField = {
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

export const specFields: Record<ProductCategory, SpecField[]> = {
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

type AdminProductModalProps = {
  product: Product | null;
  values: Partial<ProductRequest>;
  brands: ApiBrand[];
  warrantyPolicies: WarrantyPolicy[];
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (
    data: FormData,
    category: ProductCategory,
    imageUrls: string[],
  ) => Promise<void>;
};

export function AdminProductModal({
  product,
  values,
  brands,
  warrantyPolicies,
  busy,
  error,
  onClose,
  onSubmit,
}: AdminProductModalProps) {
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "SMARTPHONE",
  );
  const [imageUrls, setImageUrls] = useState(
    product?.images.map((image) => getProductImageStoragePath(image.imageUrl)) ??
      [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const newFilePreviews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );
  useEffect(
    () => () => newFilePreviews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [newFilePreviews],
  );

  function moveImage(index: number, direction: number) {
    setImageUrls((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function makePrimary(index: number) {
    setImageUrls((current) => {
      if (index <= 0) return current;
      const next = [...current];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="product-modal-title" className="text-xl font-semibold text-text">
            {product ? `Chỉnh sửa: ${product.name}` : "Thêm sản phẩm"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Đóng"
            className="rounded-lg px-3 py-1 text-xl text-text-muted hover:bg-surface-muted disabled:opacity-50"
          >
            ×
          </button>
        </div>
        {error ? (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <form
          key={product?.id ?? "new-product"}
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(new FormData(event.currentTarget), category, imageUrls);
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="space-y-1 text-sm font-medium text-text">
            SKU
            <input name="sku" required defaultValue={values.sku} className="h-10 w-full rounded-lg border border-border px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Tên sản phẩm
            <input name="name" required defaultValue={values.name} className="h-10 w-full rounded-lg border border-border px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Giá
            <input name="price" required type="number" min="0" step="0.01" defaultValue={values.price} className="h-10 w-full rounded-lg border border-border px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Danh mục
            <select
              name="category"
              value={category}
              disabled={Boolean(product)}
              onChange={(event) => setCategory(event.target.value as ProductCategory)}
              className="h-10 w-full rounded-lg border border-border px-3"
            >
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Thương hiệu
            <select name="brandId" required defaultValue={values.brandId ?? ""} className="h-10 w-full rounded-lg border border-border px-3">
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Bảo hành
            <select name="warrantyPolicyId" defaultValue={values.warrantyPolicyId ?? ""} className="h-10 w-full rounded-lg border border-border px-3">
              <option value="">Không áp dụng</option>
              {warrantyPolicies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name} ({policy.durationMonths} tháng)</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-text">
            Trạng thái
            <select name="status" defaultValue={values.status ?? "IN_STOCK"} className="h-10 w-full rounded-lg border border-border px-3">
              <option value="IN_STOCK">Đang bán</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
              <option value="DISCONTINUED">Ngừng kinh doanh</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-text sm:col-span-2 lg:col-span-3">
            Mô tả
            <textarea name="description" required defaultValue={values.description} className="min-h-20 w-full rounded-lg border border-border p-3" />
          </label>

          <div key={category} className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            {specFields[category].map((field) => {
              const value = values[field.name];
              if (field.type === "boolean") {
                return (
                  <label key={field.name} className="space-y-1 text-sm font-medium text-text">
                    {field.label}
                    <select
                      name={String(field.name)}
                      required={!product}
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
                <label key={field.name} className="space-y-1 text-sm font-medium text-text">
                  {field.label}
                  <input
                    name={String(field.name)}
                    required={!product}
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
            <p>
              Ảnh sản phẩm · {imageUrls.length + newFiles.length}/8
              {newFiles.length > 0 ? ` (thêm mới ${newFiles.length})` : ""}
            </p>
            <p className="text-xs font-normal text-text-muted">
              Ảnh đầu tiên là ảnh chính. Dùng nút để đặt ảnh chính hoặc sắp xếp.
            </p>
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imageUrls.map((imageUrl, index) => (
                  <div key={imageUrl} className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
                      <Image
                        src={imageUrl.startsWith("/") ? `${getApiOrigin()}${imageUrl}` : imageUrl}
                        alt="Ảnh sản phẩm"
                        fill
                        unoptimized
                        sizes="160px"
                        className="object-cover"
                      />
                      {index === 0 ? (
                        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                          Ảnh chính
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      {index !== 0 ? (
                        <button
                          type="button"
                          onClick={() => makePrimary(index)}
                          className="text-primary"
                        >
                          Ảnh chính
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        aria-label="Di chuyển sang trái"
                        className="rounded border border-border px-1.5 text-text disabled:opacity-40"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === imageUrls.length - 1}
                        aria-label="Di chuyển sang phải"
                        className="rounded border border-border px-1.5 text-text disabled:opacity-40"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls((current) =>
                            current.filter((url) => url !== imageUrl),
                          )
                        }
                        className="text-red-700"
                      >
                        Gỡ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {newFilePreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {newFilePreviews.map(({ file, url }) => (
                  <div key={url} className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
                      <Image
                        src={url}
                        alt={file.name}
                        fill
                        unoptimized
                        sizes="160px"
                        className="object-cover opacity-90"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-xs font-semibold text-text">
                        Mới
                      </span>
                    </div>
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
                disabled={imageUrls.length + newFiles.length >= 8}
                onChange={(event) =>
                  setNewFiles(Array.from(event.currentTarget.files ?? []))
                }
                className="block w-full rounded-lg border border-border p-3 text-sm"
              />
            </label>
          </div>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
            <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {busy ? "Đang lưu..." : product ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
            <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50">
              Hủy
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
