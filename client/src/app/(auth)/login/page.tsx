"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/api/auth.service";
import { dispatchAuthChange } from "@/hooks/use-current-user";

export default function LoginPage() {
  // Hook điều hướng trang của Next.js App Router
  const router = useRouter();

  // State lưu trữ thông báo lỗi nhận được từ Backend (nếu có)
  const [error, setError] = useState<string | null>(null);

  // State biểu thị trạng thái đang xử lý đăng nhập (dùng để vô hiệu hóa nút submit, tránh spam)
  const [submitting, setSubmitting] = useState(false);

  /**
   * Xử lý sự kiện gửi form đăng nhập
   * @param event - Sự kiện submit form
   */
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    // 1. Ngăn chặn hành vi reload trang mặc định của trình duyệt
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    // 2. Thu thập dữ liệu các ô input bằng FormData
    const data = new FormData(event.currentTarget);

    try {
      // 3. Gọi tầng Service gửi request xác thực tới Servlet Backend
      const user = await login({
        email: String(data.get("email")),
        password: String(data.get("password")),
      });

      // 4. Phát tín hiệu cập nhật trạng thái đăng nhập cho Header và các component
      dispatchAuthChange();

      // 5. Kiểm tra vai trò của người dùng để điều hướng phù hợp
      router.push(user.role === "ADMIN" ? "/admin" : "/profile");
      router.refresh();
    } catch (requestError) {
      // 5. Bắt lỗi từ Backend và hiển thị lên giao diện
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đăng nhập thất bại. Vui lòng thử lại sau.",
      );
    } finally {
      // 6. Hoàn tất chu kỳ xử lý, mở lại nút submit
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      {/* Khung Form đăng nhập */}
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-border bg-surface p-7 shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-primary">Chào mừng trở lại</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Đăng nhập</h1>
        </div>

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

        {/* Ô nhập Mật khẩu */}
        <label className="block text-sm font-semibold text-text">
          <div className="flex items-center justify-between">
            <span>Mật khẩu</span>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Thông báo lỗi nếu đăng nhập thất bại */}
        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {/* Nút bấm Đăng nhập */}
        <button
          disabled={submitting}
          className="h-11 w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {/* Liên kết chuyển sang trang Đăng ký */}
        <p className="text-sm text-text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Tạo tài khoản mới
          </Link>
        </p>
      </form>
    </main>
  );
}
