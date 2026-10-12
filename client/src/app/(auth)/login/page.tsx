"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/api/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      const user = await login({
        email: String(data.get("email")),
        password: String(data.get("password")),
      });
      router.push(user.role === "ADMIN" ? "/admin" : "/profile");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-surface p-7">
        <div>
          <p className="text-sm font-semibold text-primary">Chào mừng trở lại</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Đăng nhập</h1>
        </div>
        <label className="block text-sm font-semibold text-text">
          Email
          <input name="email" type="email" required autoComplete="email" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        <label className="block text-sm font-semibold text-text">
          Mật khẩu
          <input name="password" type="password" required autoComplete="current-password" className="mt-2 h-11 w-full rounded-lg border border-border px-3 font-normal outline-none focus:border-primary" />
        </label>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        <button disabled={submitting} className="h-11 w-full rounded-lg bg-primary font-semibold text-white disabled:opacity-60">
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p className="text-sm text-text-muted">
          Chưa có tài khoản? <Link href="/register" className="font-semibold text-primary">Tạo tài khoản</Link>
        </p>
      </form>
    </main>
  );
}
