"use client";

/**
 * =============================================================================
 * TRANG QUẢN LÝ NGƯỜI DÙNG DÀNH CHO QUẢN TRỊ VIÊN (ADMIN USERS MANAGEMENT)
 * =============================================================================
 * - Vai trò: Cho phép Quản trị viên (ADMIN) theo dõi toàn bộ danh sách tài khoản
 *   người dùng trên hệ thống, thực hiện tạo mới người dùng và khóa / mở khóa tài khoản.
 * - Các tính năng chính:
 *   1. Kiểm soát quyền truy cập: Chỉ cho phép người dùng có vai trò ADMIN thao tác.
 *   2. Tải danh sách người dùng: Gọi API GET /api/admin/users để hiển thị dạng bảng.
 *   3. Tạo tài khoản mới: Quản trị viên có thể tạo trực tiếp tài khoản CUSTOMER hoặc ADMIN.
 *   4. Quản lý trạng thái: Khóa (LOCKED) hoặc Mở khóa (ACTIVE) người dùng theo thời gian thực.
 * =============================================================================
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createAdminUser, getAdminUsers, toggleAdminUserStatus } from "@/api/admin.service";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ApiUser } from "@/types/user.types";

export default function AdminUsersPage() {
  // Lấy thông tin tài khoản đang đăng nhập từ Custom Hook useCurrentUser
  const { user, loading: checkingUser } = useCurrentUser();

  // State lưu trữ danh sách người dùng lấy từ Backend
  const [users, setUsers] = useState<ApiUser[]>([]);

  // State biểu thị trạng thái đang tải danh sách người dùng
  const [loadingUsers, setLoadingUsers] = useState(true);

  // State lưu thông báo lỗi từ hệ thống (nếu có)
  const [error, setError] = useState<string | null>(null);

  // State biểu thị trạng thái đang thực hiện tạo tài khoản mới (tránh click đúp)
  const [busy, setBusy] = useState(false);

  /**
   * Tải lại toàn bộ danh sách người dùng từ máy chủ Backend
   */
  const loadUsers = useCallback(async () => {
    const result = await getAdminUsers();
    setUsers(result);
  }, []);

  /**
   * Hook kiểm tra quyền truy cập và tự động tải dữ liệu ban đầu
   */
  useEffect(() => {
    // Nếu không phải ADMIN, không thực hiện truy vấn API để bảo mật
    if (user?.role !== "ADMIN") return;

    let cancelled = false;

    // Gọi API lấy danh sách tài khoản
    getAdminUsers()
      .then((result) => {
        if (!cancelled) setUsers(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải danh sách người dùng."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });

    // Cleanup function: Hủy cập nhật state nếu component bị unmount trong lúc đang tải
    return () => {
      cancelled = true;
    };
  }, [user]);

  /**
   * Xử lý tạo mới tài khoản người dùng bởi Quản trị viên
   * @param event - Sự kiện submit form
   */
  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    try {
      // Gọi API POST /api/admin/users
      await createAdminUser({
        fullName: String(data.get("fullName")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        role: String(data.get("role")) as ApiUser["role"],
        phone: String(data.get("phone")),
      });

      // Đặt lại các trường nhập liệu trong form về mặc định
      event.currentTarget.reset();

      // Tải lại bảng danh sách người dùng để hiển thị tài khoản vừa thêm
      await loadUsers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể tạo tài khoản."
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý thay đổi trạng thái tài khoản người dùng (Khóa / Mở khóa)
   * @param target - Bản ghi người dùng cần cập nhật trạng thái
   */
  async function toggleStatus(target: ApiUser) {
    // Chuyển đổi trạng thái đối nghịch: LOCKED -> ACTIVE hoặc ACTIVE -> LOCKED
    const status = target.status === "LOCKED" ? "ACTIVE" : "LOCKED";
    setError(null);

    try {
      // Gọi API PUT /api/admin/users?id=...&status=...
      const updated = await toggleAdminUserStatus(target.id, status);

      // Cập nhật trạng thái trực tiếp trong state cục bộ để UI phản hồi tức thì
      setUsers((current) =>
        current.map((item) => (item.id === target.id ? updated : item))
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể cập nhật trạng thái tài khoản."
      );
    }
  }

  // 1. Trường hợp hệ thống đang xác thực danh tính phiên làm việc
  if (checkingUser) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 text-text-muted" role="status">
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  // 2. Trường hợp người dùng không có vai trò Quản trị viên (ADMIN)
  if (user?.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p role="alert" className="text-red-700">
          Bạn cần quyền quản trị viên để truy cập trang này.
        </p>
        <Link href="/login" className="text-primary font-semibold mt-2 inline-block">
          Đăng nhập bằng tài khoản Quản trị
        </Link>
      </main>
    );
  }

  // 3. Giao diện trang Quản trị khi người dùng đã được cấp quyền hợp lệ
  return (
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-10 sm:px-8">
      {/* Tiêu đề trang và liên kết quay về bảng điều khiển Quản trị */}
      <div>
        <Link href="/admin" className="text-sm font-semibold text-primary">
          ← Quay lại Quản trị
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-text">Quản lý người dùng</h1>
      </div>

      {/* Hiển thị thông báo lỗi hệ thống nếu phát sinh sự cố */}
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {/* Form tạo mới tài khoản người dùng trực tiếp từ Quản trị viên */}
      <form
        onSubmit={createUser}
        className="rounded-xl border border-border bg-surface p-6 space-y-4"
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
            placeholder="Mật khẩu"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <input
            name="phone"
            placeholder="Số điện thoại"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
          />
          <select
            name="role"
            className="h-10 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary bg-surface text-text"
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

      {/* Bảng hiển thị danh sách người dùng với các cột được căn chỉnh chuẩn */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-6 py-3.5">Họ và tên</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5 text-center w-36">Vai trò</th>
              <th className="px-6 py-3.5 text-right w-36">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loadingUsers ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-muted">
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-muted">
                  Chưa có người dùng nào trong hệ thống.
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id} className="hover:bg-surface-muted/40 transition">
                  {/* Họ tên người dùng */}
                  <td className="px-6 py-4 font-medium text-text">{item.fullName}</td>

                  {/* Địa chỉ Email */}
                  <td className="px-6 py-4 text-text-muted truncate max-w-xs">{item.email}</td>

                  {/* Nhãn vai trò (Badge hiển thị ADMIN hoặc CUSTOMER) */}
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

                  {/* Nút thao tác Khóa / Mở khóa tài khoản */}
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
                      {item.status === "LOCKED" ? "Mở khóa" : "Khóa tài khoản"}
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
