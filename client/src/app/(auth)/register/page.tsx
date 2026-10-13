"use client";

/**
 * - Luồng xử lý:
 *   1. Thu thập dữ liệu từ Form (Họ tên, Email, Số điện thoại, Mật khẩu).
 *   2. Gửi yêu cầu POST tới API /api/auth/register thông qua auth.service.ts.
 *   3. Backend mã hóa mật khẩu bằng BCrypt, lưu tài khoản vào cơ sở dữ liệu với vai trò CUSTOMER.
 *   4. Nếu thành công: Tự động chuyển hướng người dùng sang trang Đăng nhập (/login).
 *   5. Nếu thất bại: Hiển thị thông báo lỗi (email đã tồn tại, định dạng không hợp lệ...).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/api/auth.service";

export default function RegisterPage() {
  // Hook điều hướng trang của Next.js
  const router = useRouter();

  // State quản lý thông báo lỗi trả về từ Backend
  const [error, setError] = useState<string | null>(null);

  // State quản lý trạng thái đang gửi yêu cầu đăng ký
  const [submitting, setSubmitting] = useState(false);

  /**
   * Xử lý sự kiện gửi form đăng ký tài khoản
   * @param event - Sự kiện submit form
   */
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    // 1. Ngăn chặn hành vi reload trang mặc định của trình duyệt
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    // 2. Thu thập dữ liệu các trường nhập liệu từ Form
    const data = new FormData(event.currentTarget);

    try {
      // 3. Gọi hàm register từ Service để gửi request đăng ký về Backend
      await register({
        fullName: String(data.get("fullName")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        phone: String(data.get("phone")),
      });

      // 4. Đăng ký thành công -> chuyển hướng sang trang đăng nhập
      router.push("/login");
    } catch (requestError) {
      // 5. Bắt lỗi từ Backend và hiển thị lên giao diện
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đăng ký thất bại. Vui lòng thử lại sau.",
      );
    } finally {
      // 6. Hoàn tất quá trình gửi dữ liệu, mở lại nút bấm
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      {/* Khung Form đăng ký */}
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-border bg-surface p-7 shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-primary">Thành viên PhoneStore</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Tạo tài khoản</h1>
        </div>

        {/* Ô nhập Họ và tên */}
        <label className="block text-sm font-semibold text-text">
          Họ và tên
          <input
            name="fullName"
            required
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Ô nhập Email */}
        <label className="block text-sm font-semibold text-text">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="example@test.com"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Ô nhập Số điện thoại */}
        <label className="block text-sm font-semibold text-text">
          Số điện thoại
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0912345678"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Ô nhập Mật khẩu */}
        <label className="block text-sm font-semibold text-text">
          Mật khẩu (tối thiểu 8 ký tự)
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Thông báo lỗi nếu đăng ký thất bại */}
        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {/* Nút bấm Đăng ký */}
        <button
          disabled={submitting}
          className="h-11 w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        {/* Liên kết quay lại Đăng nhập */}
        <p className="text-sm text-text-muted">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </main>
  );
}
