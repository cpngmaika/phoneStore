"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createAdminUser, getAdminUsers, toggleAdminUserStatus } from "@/api/admin.service";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiUser } from "@/types/user.types";

export default function AdminUsersPage() {
  const { user, loading: checkingUser } = useCurrentUser();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadUsers = useCallback(async () => {
    const result = await getAdminUsers();
    setUsers(result);
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    let cancelled = false;
    getAdminUsers()
      .then((result) => {
        if (!cancelled) setUsers(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải người dùng.");
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await createAdminUser({
        fullName: String(data.get("fullName")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        role: String(data.get("role")) as ApiUser["role"],
        phone: String(data.get("phone")),
      });
      event.currentTarget.reset();
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể tạo tài khoản.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(target: ApiUser) {
    const status = target.status === "LOCKED" ? "ACTIVE" : "LOCKED";
    setError(null);
    try {
      const updated = await toggleAdminUserStatus(target.id, status);
      setUsers((current) => current.map((item) => item.id === target.id ? updated : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể cập nhật tài khoản.");
    }
  }

  if (checkingUser) return <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">Đang kiểm tra quyền truy cập...</main>;
  if (user?.role !== "ADMIN") return <main className="mx-auto max-w-6xl px-5 py-16"><p role="alert" className="text-red-700">Bạn cần quyền quản trị.</p><Link href="/login" className="text-primary">Đăng nhập</Link></main>;

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div><Link href="/admin" className="text-sm font-semibold text-primary">← Quản trị</Link><h1 className="mt-3 text-3xl font-semibold text-text">Người dùng</h1></div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <form onSubmit={createUser} className="grid gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-5">
        <h2 className="font-semibold text-text sm:col-span-2 lg:col-span-5">Tạo tài khoản nhân viên</h2>
        <input name="fullName" required placeholder="Họ tên" className="h-10 rounded-lg border border-border px-3" />
        <input name="email" required type="email" placeholder="Email" className="h-10 rounded-lg border border-border px-3" />
        <input name="password" required type="password" placeholder="Mật khẩu" className="h-10 rounded-lg border border-border px-3" />
        <input name="phone" placeholder="Điện thoại" className="h-10 rounded-lg border border-border px-3" />
        <select name="role" className="h-10 rounded-lg border border-border px-3"><option value="STAFF">Nhân viên</option><option value="ADMIN">Quản trị viên</option></select>
        <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Tạo người dùng</button>
      </form>
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-border bg-surface-muted px-5 py-3 text-xs font-semibold uppercase text-text-muted"><span>Tên</span><span>Email</span><span>Vai trò</span><span>Trạng thái</span></div>
        {loadingUsers ? <p role="status" className="p-5 text-sm text-text-muted">Đang tải người dùng...</p> : users.map((item) => (
          <article key={item.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-4 text-sm last:border-b-0">
            <span className="font-medium text-text">{item.fullName}</span><span className="truncate text-text-muted">{item.email}</span><span className="text-text">{item.role}</span>
            <button type="button" onClick={() => toggleStatus(item)} className="font-semibold text-primary">{item.status === "LOCKED" ? "Mở khóa" : "Khóa"}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
