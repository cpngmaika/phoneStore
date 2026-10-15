"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getBrands } from "@/api/brands.service";
import {  AdminProductModal,  specFields,} from "@/components/products/AdminProductModal";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import {createProduct, deleteProduct, getProductImageStoragePath, getProducts, updateProduct,} from "@/api/products.service";
import { getWarrantyPolicies } from "@/api/warranty-policies.service";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiBrand } from "@/types/brand.types";
import type { Product, ProductCategory, ProductRequest } from "@/types/product.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

/**
 * HÀM BỔ TRỢ: Chuyển đổi dữ liệu Entity Product trả về từ Server
 * thành dạng Form Values (Partial<ProductRequest>) để điền dữ liệu sẵn vào Form khi bấm "Sửa".
 */
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
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  // =========================================================================
  // 1. PHƯƠNG THỨC HTTP: [GET]
  // Hàm tải lại danh sách sản phẩm từ Server
  // =========================================================================
  const loadProducts = useCallback(async () => {
    setProducts(await getProducts());
  }, []);


  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;

    // [HTTP GET] Gọi đồng thời 3 APIs theo phương thức GET
    Promise.all([
      getProducts(),          // GET /api/products
      getBrands(),            // GET /api/brands
      getWarrantyPolicies()   // GET /api/warranty-policies
    ])
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

  // =========================================================================
  // 2 & 3. PHƯƠNG THỨC HTTP: [POST] VÀ [PUT]
  // Hàm lưu sản phẩm (Phân nhánh Tạo mới [POST] hoặc Cập nhật [PUT])
  // =========================================================================
  async function saveProduct(
    data: FormData,
    category: ProductCategory,
    imageUrls: string[],
  ) {
    setBusy(true);
    setError(null);

    try {
      // Step A: Thu thập và validate danh sách File ảnh mới được chọn từ Input
      const imageFiles = data
        .getAll("images")
        .filter((value): value is File => value instanceof File && value.size > 0);

      // Validation 1: Kiểm tra dung lượng mỗi tệp (Tối đa 5 MB)
      const invalidImage = imageFiles.find((file) => file.size > 5 * 1024 * 1024);
      if (invalidImage) {
        throw new Error("Mỗi ảnh tải lên không được vượt quá 5 MB.");
      }

      // Validation 2: Kiểm tra tổng số lượng ảnh (Ảnh cũ còn giữ + Ảnh mới <= 8)
      if (imageUrls.length + imageFiles.length > 8) {
        throw new Error("Mỗi sản phẩm được lưu tối đa 8 ảnh.");
      }

      // Step B: Đóng gói đối tượng DTO (ProductRequest) chứa dữ liệu text/number
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
        imageUrls, // Mảng chứa URL các ảnh cũ vẫn giữ lại
      };

      // Step C: Đóng gói động các trường thông số kỹ thuật (SpecFields) vào DTO Payload
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

      // Step D: Phân nhánh gửi Request HTTP dựa trên chế độ (Thêm / Sửa)
      if (editingProduct) {
        // [HTTP PUT] Cập nhật sản phẩm theo ID
        // Tương đương: PUT /api/products/{id} với Content-Type: multipart/form-data
        await updateProduct(editingProduct.id, payload, imageFiles);
      } else {
        // [HTTP POST] Tạo mới sản phẩm
        // Tương đương: POST /api/products với Content-Type: multipart/form-data
        await createProduct(payload, imageFiles);
      }

      // Step E: Reset Form và làm sạch State sau khi thành công
      // [HTTP GET] Re-fetch lại danh sách sản phẩm mới nhất
      await loadProducts();
      setEditingProduct(null);
      setProductModalOpen(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể lưu sản phẩm.");
    } finally {
      setBusy(false);
    }
  }

  // Chuyển form sang trạng thái Chỉnh sửa (Fill thông tin sẵn vào input)
  function startEditing(product: Product) {
    setEditingProduct(product);
    setProductModalOpen(true);
  }

  // =========================================================================
  // 4. PHƯƠNG THỨC HTTP: [DELETE]
  // Hàm xóa sản phẩm khỏi hệ thống
  // =========================================================================
  async function removeProduct(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setError(null);
    setDeletingProductId(id);
    try {
      // [HTTP DELETE] Gửi yêu cầu xóa tới Backend
      // Tương đương: DELETE /api/products/{id}
      await deleteProduct(id);

      // Cập nhật giao diện lập tức bằng cách lọc bỏ sản phẩm vừa xóa khỏi State
      setProducts((current) => current.filter((product) => product.id !== id));

      // Reset form nếu sản phẩm đang chỉnh sửa chính là sản phẩm vừa bị xóa
      if (editingProduct?.id === id) {
        setEditingProduct(null);
        setProductModalOpen(false);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể xóa sản phẩm.");
    } finally {
      setDeletingProductId(null);
    }
  }

  // --- RENDERING CONDITIONAL UI (KIỂM TRA QUYỀN TRUY CẬP) ---
  if (checkingUser) return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  if (user?.role !== "ADMIN") return <main className="mx-auto max-w-6xl px-5 py-16"><p role="alert" className="text-red-700">Bạn cần quyền quản trị.</p><Link href="/login" className="text-primary">Đăng nhập</Link></main>;

  const pageSize = 12;
  const pageCount = Math.ceil(products.length / pageSize);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-primary">← Quản trị</Link>
        <h1 className="mt-3 text-3xl font-semibold text-text">Quản lý sản phẩm</h1>
      </div>
      {error && !productModalOpen ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : null}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setError(null);
            setProductModalOpen(true);
          }}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Thêm sản phẩm
        </button>
      </div>
      {loadingProducts ? (
        <p role="status" className="rounded-xl border border-border bg-surface p-5 text-sm text-text-muted">
          Đang tải sản phẩm...
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
          Chưa có sản phẩm.
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actions={{
                onEdit: () => startEditing(product),
                onDelete: () => void removeProduct(product.id),
                deleting: deletingProductId === product.id,
              }}
            />
          ))}
        </div>
      )}
      {!loadingProducts && products.length > 0 ? (
        <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      ) : null}
      {productModalOpen ? (
        <AdminProductModal
          key={editingProduct?.id ?? "new-product"}
          product={editingProduct}
          values={editingProduct ? productFormValues(editingProduct) : {}}
          brands={brands}
          warrantyPolicies={warrantyPolicies}
          busy={busy}
          error={error}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
            setError(null);
          }}
          onSubmit={saveProduct}
        />
      ) : null}
    </main>
  );
}