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
      setUsers((current) => current.map((item) => (item.id === target.id ? updated : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể cập nhật tài khoản.");
    }
  }

  if (checkingUser) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p role="alert" className="text-red-700">Bạn cần quyền quản trị.</p>
        <Link href="/login" className="text-primary font-semibold mt-2 inline-block">Đăng nhập</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-primary">← Quản trị</Link>
        <h1 className="mt-3 text-3xl font-semibold text-text">Người dùng</h1>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={createUser} className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <h2 className="font-semibold text-text">Tạo tài khoản người dùng</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input name="fullName" required placeholder="Họ tên" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <input name="email" required type="email" placeholder="Email" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <input name="password" required type="password" placeholder="Mật khẩu" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <input name="phone" placeholder="Điện thoại" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary" />
          <select name="role" className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary bg-surface text-text">
            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
        <button disabled={busy} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60">
          {busy ? "Đang tạo..." : "Tạo người dùng"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-6 py-3.5">Tên</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5 text-center w-36">Vai trò</th>
              <th className="px-6 py-3.5 text-right w-36">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loadingUsers ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-muted">
                  Đang tải người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-muted">
                  Chưa có người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id} className="hover:bg-surface-muted/40 transition">
                  <td className="px-6 py-4 font-medium text-text">{item.fullName}</td>
                  <td className="px-6 py-4 text-text-muted truncate max-w-xs">{item.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className={`font-semibold text-xs px-3 py-1 rounded-full transition ${
                        item.status === "LOCKED"
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-red-700 bg-red-50 hover:bg-red-100"
                      }`}
                    >
                      {item.status === "LOCKED" ? "Mở khóa" : "Khóa"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
