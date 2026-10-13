"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/api/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      await register({
        fullName: String(data.get("fullName")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        phone: String(data.get("phone")),
      });
      router.push("/login");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Đăng ký thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-surface p-7">
        <div>
          <p className="text-sm font-semibold text-primary">Thành viên PhoneStore</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Tạo tài khoản</h1>
        </div>
        <label className="block text-sm font-semibold text-text">Họ và tên
          <input name="fullName" required autoComplete="name" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        <label className="block text-sm font-semibold text-text">Email
          <input name="email" type="email" required autoComplete="email" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        <label className="block text-sm font-semibold text-text">Số điện thoại
          <input name="phone" type="tel" autoComplete="tel" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        <label className="block text-sm font-semibold text-text">Mật khẩu
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        <button disabled={submitting} className="h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:opacity-60">
          {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
        <p className="text-sm text-text-muted">
          Đã có tài khoản? <Link href="/login" className="font-semibold text-primary">Đăng nhập</Link>
        </p>
      </form>
    </main>
  );
}
