import Link from "next/link";
import type { FormEvent } from "react";
import type { ApiAddress, ApiUser } from "@/types/user.types";

type ProfileViewProps = {
  profile: ApiUser | null;
  addresses: ApiAddress[];
  busy: boolean;
  message: string | null;
  error: string | null;
  onSaveProfile: (event: FormEvent<HTMLFormElement>) => void;
  onChangePassword: (event: FormEvent<HTMLFormElement>) => void;
  onSaveAddress: (event: FormEvent<HTMLFormElement>) => void;
  onRemoveAddress: (id: number) => void;
};

export function ProfileView({
  profile,
  addresses,
  busy,
  message,
  error,
  onSaveProfile,
  onChangePassword,
  onSaveAddress,
  onRemoveAddress,
}: ProfileViewProps) {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <p className="text-sm font-semibold text-primary">Tài khoản</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Hồ sơ của tôi</h1>
        {profile ? <p className="mt-2 text-sm text-text-muted">{profile.email}</p> : null}
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">
          {message}
        </p>
      ) : null}

      {profile ? (
        <form onSubmit={onSaveProfile} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-text">Thông tin cá nhân</h2>
          <label className="block text-sm font-medium text-text">
            Họ và tên
            <input
              name="fullName"
              required
              defaultValue={profile.fullName}
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none transition focus:border-primary"
            />
          </label>
          <label className="block text-sm font-medium text-text">
            Số điện thoại
            <input
              name="phone"
              defaultValue={profile.phone ?? ""}
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none transition focus:border-primary"
            />
          </label>
          <div className="flex items-center gap-4 pt-2">
            <button
              disabled={busy}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              Lưu hồ sơ
            </button>
            <Link href="/orders" className="text-sm font-semibold text-primary hover:underline">
              Xem đơn hàng đã mua
            </Link>
          </div>
        </form>
      ) : null}

      <form onSubmit={onChangePassword} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text">Đổi mật khẩu</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-text">
            Mật khẩu hiện tại
            <input
              name="oldPassword"
              type="password"
              required
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none transition focus:border-primary"
            />
          </label>
          <label className="block text-sm font-medium text-text">
            Mật khẩu mới (tối thiểu 8 ký tự)
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none transition focus:border-primary"
            />
          </label>
        </div>
        <button
          disabled={busy}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-muted disabled:opacity-60"
        >
          Cập nhật mật khẩu
        </button>
      </form>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text">Địa chỉ giao hàng</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-text-muted">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className="flex items-start justify-between gap-4 rounded-lg bg-surface-muted p-4">
              <div className="text-sm text-text">
                <p className="font-semibold">{address.receiverName} · {address.receiverPhone}</p>
                <p className="mt-1 text-text-muted">
                  {address.streetDetail}, {address.ward}, {address.district}, {address.province}, {address.country}
                </p>
                {address.isDefault ? (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Mặc định
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onRemoveAddress(address.id)}
                className="text-sm font-semibold text-red-600 transition hover:underline"
              >
                Xóa
              </button>
            </article>
          ))
        )}

        <form onSubmit={onSaveAddress} className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
          <h3 className="font-semibold text-text sm:col-span-2">Thêm địa chỉ mới</h3>
          <input name="receiverName" required placeholder="Tên người nhận" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="receiverPhone" required placeholder="Số điện thoại" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="country" required placeholder="Quốc gia" defaultValue="Vietnam" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="province" required placeholder="Tỉnh / Thành phố" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="district" required placeholder="Quận / Huyện" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="ward" required placeholder="Phường / Xã" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary" />
          <input name="streetDetail" required placeholder="Số nhà, tên đường chi tiết" className="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-text sm:col-span-2">
            <input type="checkbox" name="isDefault" /> Đặt làm địa chỉ mặc định
          </label>
          <button
            disabled={busy}
            className="w-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:col-span-2"
          >
            Thêm địa chỉ
          </button>
        </form>
      </section>
    </main>
  );
}
