"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/api/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có tối thiểu 8 ký tự.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword({
        email,
        phone,
        newPassword,
      });

      setSuccess("Đặt lại mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đặt lại mật khẩu thất bại. Vui lòng thử lại sau.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-border bg-surface p-7 shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-primary">Khôi phục tài khoản</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Quên mật khẩu</h1>
          <p className="mt-1 text-sm text-text-muted">
            Nhập email và số điện thoại đã đăng ký để thiết lập mật khẩu mới.
          </p>
        </div>

        {/* Ô nhập Email */}
        <label className="block text-sm font-semibold text-text">
          Email đã đăng ký
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
          Số điện thoại đã đăng ký
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="0912345678"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Ô nhập Mật khẩu mới */}
        <label className="block text-sm font-semibold text-text">
          Mật khẩu mới (tối thiểu 8 ký tự)
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Ô nhập Xác nhận mật khẩu mới */}
        <label className="block text-sm font-semibold text-text">
          Xác nhận mật khẩu mới
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none transition focus:border-primary"
          />
        </label>

        {/* Thông báo lỗi nếu có */}
        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {/* Thông báo thành công */}
        {success ? (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
            {success}
          </p>
        ) : null}

        {/* Nút bấm Submit */}
        <button
          type="submit"
          disabled={submitting || !!success}
          className="h-11 w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>

        {/* Liên kết quay lại Đăng nhập */}
        <p className="text-center text-sm text-text-muted">
          Nhớ mật khẩu rồi?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Quay lại Đăng nhập
          </Link>
        </p>
      </form>
    </main>
  );
}
