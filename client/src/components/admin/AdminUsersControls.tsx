import type { FormEvent } from "react";
import type { ApiUser } from "@/types/user.types";

type AdminUsersControlsProps = {
  busy: boolean;
  loading: boolean;
  keyword: string;
  roleFilter: ApiUser["role"] | "";
  statusFilter: ApiUser["status"] | "";
  totalUsers: number;
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: ApiUser["role"] | "") => void;
  onStatusChange: (value: ApiUser["status"] | "") => void;
  onReset: () => void;
};

export function AdminUsersControls({
  busy,
  loading,
  keyword,
  roleFilter,
  statusFilter,
  totalUsers,
  onCreate,
  onSearch,
  onKeywordChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: AdminUsersControlsProps) {
  return (
    <>
      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-xl border border-border bg-surface p-6"
      >
        <h2 className="font-semibold text-text">Tạo tài khoản người dùng mới</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            name="fullName"
            required
            placeholder="Họ và tên"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Địa chỉ Email"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <input
            name="password"
            required
            type="password"
            minLength={8}
            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <input
            name="phone"
            placeholder="Số điện thoại"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <select
            name="role"
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
          >
            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
        <button
          disabled={busy}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? "Đang xử lý..." : "Tạo người dùng"}
        </button>
      </form>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-text">Bộ lọc & Tìm kiếm người dùng</h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Tìm theo từ khóa (họ tên, email, SĐT) và phân loại theo vai trò, trạng thái.
            </p>
          </div>
          <span className="self-start rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-muted sm:self-auto">
            Tổng cộng: {totalUsers} người dùng
          </span>
        </div>
        <form onSubmit={onSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <input
              type="text"
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="Nhập tên, email hoặc số điện thoại..."
              className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(event) => onRoleChange(event.target.value as ApiUser["role"] | "")}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
            >
              <option value="">Tất cả vai trò</option>
              <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value as ApiUser["status"] | "")}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động (ACTIVE)</option>
              <option value="LOCKED">Đã khóa (LOCKED)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="h-10 flex-1 rounded-lg bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={loading}
              className="h-10 rounded-lg border border-border px-3 text-sm font-semibold text-text-muted transition hover:bg-surface-muted disabled:opacity-60"
            >
              Đặt lại
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
