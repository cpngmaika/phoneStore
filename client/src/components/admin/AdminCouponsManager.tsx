import type { FormEvent } from "react";
import type { Coupon } from "@/types/coupon.types";

export type CouponFormValues = {
  code: string;
  discountType: Coupon["discountType"];
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: string;
};

type AdminCouponsManagerProps = {
  coupons: Coupon[];
  loading: boolean;
  busy: boolean;
  editing: Coupon | null;
  form: CouponFormValues;
  onFormChange: (form: CouponFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
};

export function AdminCouponsManager({
  coupons,
  loading,
  busy,
  editing,
  form,
  onFormChange,
  onSubmit,
  onReset,
  onEdit,
  onDelete,
}: AdminCouponsManagerProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="font-semibold text-text sm:col-span-2 lg:col-span-4">
          {editing ? `Sửa mã ${editing.code}` : "Thêm mã giảm giá"}
        </h2>
        <label className="space-y-1 text-sm font-medium text-text">
          Mã giảm giá
          <input required maxLength={50} value={form.code} onChange={(event) => onFormChange({ ...form, code: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3 uppercase" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Loại giảm giá
          <select value={form.discountType} onChange={(event) => onFormChange({ ...form, discountType: event.target.value as Coupon["discountType"] })} className="h-10 w-full rounded-lg border border-border px-3">
            <option value="PERCENTAGE">Phần trăm (%)</option>
            <option value="FIXED_AMOUNT">Số tiền cố định</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Giá trị giảm
          <input required type="number" min="0.01" step="0.01" max={form.discountType === "PERCENTAGE" ? 100 : undefined} value={form.discountValue} onChange={(event) => onFormChange({ ...form, discountValue: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Đơn tối thiểu (VND)
          <input required type="number" min="0" step="0.01" value={form.minOrderAmount} onChange={(event) => onFormChange({ ...form, minOrderAmount: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Giảm tối đa (VND, tùy chọn)
          <input type="number" min="0.01" step="0.01" value={form.maxDiscountAmount} onChange={(event) => onFormChange({ ...form, maxDiscountAmount: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Ngày bắt đầu
          <input required type="date" value={form.startDate} onChange={(event) => onFormChange({ ...form, startDate: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Ngày kết thúc
          <input required type="date" value={form.endDate} onChange={(event) => onFormChange({ ...form, endDate: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="space-y-1 text-sm font-medium text-text">
          Giới hạn lượt dùng
          <input required type="number" min="1" step="1" value={form.usageLimit} onChange={(event) => onFormChange({ ...form, usageLimit: event.target.value })} className="h-10 w-full rounded-lg border border-border px-3" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-text">
          <input type="checkbox" checked={form.isActive} onChange={(event) => onFormChange({ ...form, isActive: event.target.checked })} />
          Đang kích hoạt
        </label>
        <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
          <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Tạo mã"}
          </button>
          {editing ? (
            <button type="button" onClick={onReset} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">
              Hủy sửa
            </button>
          ) : null}
        </div>
      </form>
      <section className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase text-text-muted">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Ưu đãi</th>
              <th className="px-4 py-3">Thời hạn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Đang tải mã giảm giá...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Chưa có mã giảm giá.</td></tr>
            ) : coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-3 font-mono font-semibold">{coupon.code}</td>
                <td className="px-4 py-3">{coupon.discountValue}{coupon.discountType === "PERCENTAGE" ? "%" : " VND"}</td>
                <td className="px-4 py-3">{coupon.startDate} – {coupon.endDate}</td>
                <td className="px-4 py-3">{coupon.isActive ? "Đang bật" : "Đã tắt"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => onEdit(coupon)} className="font-semibold text-primary">Sửa</button>
                    <button type="button" onClick={() => onDelete(coupon)} className="font-semibold text-red-700">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
