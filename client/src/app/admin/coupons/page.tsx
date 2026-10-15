"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AdminCouponsManager,
  type CouponFormValues,
} from "@/components/admin/AdminCouponsManager";
import {
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
  type CouponRequest,
} from "@/api/coupons.service";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { Coupon } from "@/types/coupon.types";

const initialForm: CouponFormValues = {
  code: "",
  discountType: "PERCENTAGE" as Coupon["discountType"],
  discountValue: "",
  minOrderAmount: "0",
  maxDiscountAmount: "",
  startDate: "",
  endDate: "",
  isActive: true,
  usageLimit: "1",
};

function couponToForm(coupon: Coupon): CouponFormValues {
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    minOrderAmount: String(coupon.minOrderAmount),
    maxDiscountAmount: coupon.maxDiscountAmount === null ? "" : String(coupon.maxDiscountAmount),
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    isActive: coupon.isActive,
    usageLimit: String(coupon.usageLimit),
  };
}

export default function AdminCouponsPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormValues>(initialForm);

  const loadCoupons = useCallback(async () => {
    try {
      setCoupons(await getAdminCoupons());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể tải mã giảm giá.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    getAdminCoupons()
      .then((result) => {
        if (!cancelled) setCoupons(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải mã giảm giá.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  function startEditing(coupon: Coupon) {
    setEditing(coupon);
    setForm(couponToForm(coupon));
    setError(null);
  }

  function resetForm() {
    setEditing(null);
    setForm(initialForm);
  }

  async function saveCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const payload: CouponRequest = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount),
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive,
      usageLimit: Number(form.usageLimit),
    };
    try {
      if (editing) {
        await updateCoupon(editing.id, payload);
      } else {
        await createCoupon(payload);
      }
      resetForm();
      await loadCoupons();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể lưu mã giảm giá.");
    } finally {
      setBusy(false);
    }
  }

  async function removeCoupon(coupon: Coupon) {
    if (!window.confirm(`Xóa mã giảm giá ${coupon.code}?`)) return;
    setError(null);
    try {
      await deleteCoupon(coupon.id);
      setCoupons((current) => current.filter((item) => item.id !== coupon.id));
      if (editing?.id === coupon.id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể xóa mã giảm giá.");
    }
  }

  if (checkingUser) {
    return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  }
  if (user?.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p role="alert" className="text-red-700">Bạn cần quyền quản trị viên để truy cập trang này.</p>
        <Link href="/login" className="mt-2 inline-block font-semibold text-primary">Đăng nhập</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-primary">← Quay lại Quản trị</Link>
        <h1 className="mt-3 text-3xl font-semibold text-text">Quản lý mã giảm giá</h1>
      </div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <AdminCouponsManager
        coupons={coupons}
        loading={loading}
        busy={busy}
        editing={editing}
        form={form}
        onFormChange={setForm}
        onSubmit={saveCoupon}
        onReset={resetForm}
        onEdit={startEditing}
        onDelete={(coupon) => void removeCoupon(coupon)}
      />
    </main>
  );
}
