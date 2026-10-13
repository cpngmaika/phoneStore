"use client";

/**
 * =============================================================================
 * TRANG QUẢN LÝ HỒ SƠ CÁ NHÂN (USER PROFILE & ADDRESS MANAGEMENT)
 * =============================================================================
 * - Vai trò: Cho phép người dùng đã đăng nhập:
 *   1. Xem và cập nhật thông tin cá nhân (Họ tên, Số điện thoại).
 *   2. Đổi mật khẩu tài khoản (yêu cầu mật khẩu cũ và mật khẩu mới).
 *   3. Quản lý sổ địa chỉ nhận hàng (Xem danh sách, Thêm mới, Xóa địa chỉ).
 * - Luồng hoạt động:
 *   + Khi nạp trang (useEffect): Gọi song song 2 API getProfile() và getAddresses()
 *     thông qua Promise.all để lấy dữ liệu từ Backend.
 *   + Cập nhật thông tin: Gửi request PUT /api/user/profile.
 *   + Đổi mật khẩu: Gửi request POST /api/user/change-password.
 *   + Địa chỉ nhận hàng: Gửi POST /api/user/addresses (thêm) hoặc DELETE /api/user/addresses/{id} (xóa).
 * =============================================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addAddress,
  changePassword,
  deleteAddress,
  getAddresses,
  getProfile,
  updateProfile,
} from "@/api/users.service";
import type { ApiAddress, ApiUser } from "@/types/user.types";

export default function ProfilePage() {
  // State lưu trữ thông tin tài khoản người dùng
  const [profile, setProfile] = useState<ApiUser | null>(null);

  // State lưu danh sách địa chỉ nhận hàng của người dùng
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);

  // State biểu thị trạng thái đang tải dữ liệu ban đầu
  const [loading, setLoading] = useState(true);

  // State biểu thị trạng thái đang thực hiện một thao tác gửi yêu cầu (tránh bấm nhiều lần)
  const [busy, setBusy] = useState(false);

  // State lưu thông báo thành công hiển thị cho người dùng
  const [message, setMessage] = useState<string | null>(null);

  // State lưu thông báo lỗi nếu có phát sinh ngoại lệ
  const [error, setError] = useState<string | null>(null);

  /**
   * Tải lại toàn bộ dữ liệu hồ sơ và địa chỉ từ Backend
   */
  async function load() {
    const [currentProfile, currentAddresses] = await Promise.all([
      getProfile(),
      getAddresses(),
    ]);
    setProfile(currentProfile);
    setAddresses(currentAddresses);
  }

  /**
   * Hook nạp dữ liệu tự động ngay khi component được render lần đầu
   */
  useEffect(() => {
    let cancelled = false;

    // Gọi đồng thời cả 2 API để tối ưu tốc độ nạp trang
    Promise.all([getProfile(), getAddresses()])
      .then(([currentProfile, currentAddresses]) => {
        if (!cancelled) {
          setProfile(currentProfile);
          setAddresses(currentAddresses);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải dữ liệu hồ sơ người dùng.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Xử lý lưu cập nhật thông tin cá nhân (Họ tên, Số điện thoại)
   */
  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateProfile({
        fullName: String(data.get("fullName")),
        phone: String(data.get("phone")),
      });
      // Cập nhật State với dữ liệu mới từ Backend phản hồi
      setProfile(updated);
      setMessage("Thông tin hồ sơ đã được cập nhật thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu thông tin hồ sơ.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý gửi yêu cầu đổi mật khẩu
   */
  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await changePassword({
        oldPassword: String(data.get("oldPassword")),
        newPassword: String(data.get("newPassword")),
      });
      // Đổi mật khẩu thành công -> reset các ô nhập trên Form
      form.reset();
      setMessage("Đổi mật khẩu tài khoản thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý thêm mới một địa chỉ giao hàng vào sổ địa chỉ
   */
  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await addAddress({
        receiverName: String(data.get("receiverName")),
        receiverPhone: String(data.get("receiverPhone")),
        country: String(data.get("country")),
        province: String(data.get("province")),
        district: String(data.get("district")),
        ward: String(data.get("ward")),
        streetDetail: String(data.get("streetDetail")),
        isDefault: data.get("isDefault") === "on",
      });
      event.currentTarget.reset();
      // Tải lại danh sách địa chỉ mới nhất
      await load();
      setMessage("Địa chỉ giao hàng mới đã được thêm thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể thêm địa chỉ mới.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý xóa một địa chỉ giao hàng theo ID
   * @param id - Mã định danh của địa chỉ cần xóa
   */
  async function removeAddress(id: number) {
    setError(null);
    try {
      await deleteAddress(id);
      // Cập nhật State trực tiếp bằng cách lọc bỏ địa chỉ đã xóa
      setAddresses((current) => current.filter((address) => address.id !== id));
      setMessage("Đã xóa địa chỉ thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể xóa địa chỉ.",
      );
    }
  }

  // Màn hình chờ khi đang nạp dữ liệu
  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-text-muted" role="status">
        Đang tải hồ sơ người dùng...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      {/* Tiêu đề trang */}
      <div>
        <p className="text-sm font-semibold text-primary">Tài khoản</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Hồ sơ của tôi</h1>
        {profile ? <p className="mt-2 text-sm text-text-muted">{profile.email}</p> : null}
      </div>

      {/* Hiển thị thông báo trạng thái */}
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

      {/* PHẦN 1: CẬP NHẬT THÔNG TIN CÁ NHÂN */}
      {profile ? (
        <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
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

      {/* PHẦN 2: ĐỔI MẬT KHẨU */}
      <form onSubmit={handleChangePassword} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
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

      {/* PHẦN 3: SỔ ĐỊA CHỈ GIAO HÀNG */}
      <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text">Địa chỉ giao hàng</h2>
        
        {/* Danh sách địa chỉ đã lưu */}
        {addresses.length === 0 ? (
          <p className="text-sm text-text-muted">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className="flex items-start justify-between gap-4 rounded-lg bg-surface-muted p-4">
              <div className="text-sm text-text">
                <p className="font-semibold">{address.receiverName} · {address.receiverPhone}</p>
                <p className="mt-1 text-text-muted">{address.streetDetail}, {address.ward}, {address.district}, {address.province}, {address.country}</p>
                {address.isDefault ? (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Mặc định
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeAddress(address.id)}
                className="text-sm font-semibold text-red-600 transition hover:underline"
              >
                Xóa
              </button>
            </article>
          ))
        )}

        {/* Form thêm địa chỉ mới */}
        <form onSubmit={saveAddress} className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
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
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:col-span-2 w-fit"
          >
            Thêm địa chỉ
          </button>
        </form>
      </section>
    </main>
  );
}
