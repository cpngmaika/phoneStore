"use client";

/**
 * - Vai trò: Cho phép Quản trị viên (ADMIN) theo dõi toàn bộ danh sách tài khoản
 *   người dùng trên hệ thống, tìm kiếm, lọc phân loại, tạo mới và khóa / mở khóa tài khoản.
 * - Các tính năng chính:
 *   1. Kiểm soát quyền truy cập: Chỉ cho phép người dùng có vai trò ADMIN thao tác.
 *   2. Tải & Lọc danh sách: Gọi API GET /api/admin/users hỗ trợ tìm kiếm động theo keyword, role, status.
 *   3. Tìm kiếm linh hoạt: Tìm theo tên, email, SĐT; lọc tức thì theo vai trò (CUSTOMER/ADMIN) và trạng thái (ACTIVE/LOCKED).
 *   4. Tạo tài khoản mới: Quản trị viên có thể tạo trực tiếp tài khoản CUSTOMER hoặc ADMIN.
 *   5. Quản lý trạng thái: Khóa (LOCKED) hoặc Mở khóa (ACTIVE) người dùng theo thời gian thực.
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

  // ===========================================================================
  // STATE BỘ LỌC TÌM KIẾM & PHÂN LOẠI NGƯỜI DÙNG
  // ===========================================================================
  // 1. keyword: Từ khóa tìm kiếm nhập vào (họ tên, email, số điện thoại)
  const [keyword, setKeyword] = useState("");
  // 2. roleFilter: Bộ lọc vai trò ("" = Tất cả, "CUSTOMER" = Khách hàng, "ADMIN" = Quản trị)
  const [roleFilter, setRoleFilter] = useState<ApiUser["role"] | "">("");
  // 3. statusFilter: Bộ lọc trạng thái ("" = Tất cả, "ACTIVE" = Hoạt động, "LOCKED" = Đã khóa)
  const [statusFilter, setStatusFilter] = useState<ApiUser["status"] | "">("");

  /**
   * Tải danh sách người dùng từ máy chủ Backend theo bộ lọc:
   * - Hỗ trợ tham số ghi đè (overrideFilters) để xử lý bất đồng bộ khi người dùng vừa chọn dropdown.
   * - Gọi Service getAdminUsers({ keyword, role, status }) nối query param gửi tới AdminUserServlet.
   */
  const loadUsers = useCallback(
    async (overrideFilters?: {
      keyword?: string;
      role?: ApiUser["role"] | "";
      status?: ApiUser["status"] | "";
    }) => {
      setLoadingUsers(true);
      setError(null);
      try {
        const activeKeyword =
          overrideFilters?.keyword !== undefined
            ? overrideFilters.keyword
            : keyword;
        const activeRole =
          overrideFilters?.role !== undefined
            ? overrideFilters.role
            : roleFilter;
        const activeStatus =
          overrideFilters?.status !== undefined
            ? overrideFilters.status
            : statusFilter;

        // Gửi truy vấn tìm kiếm tới API Backend
        const result = await getAdminUsers({
          keyword: activeKeyword.trim() || undefined,
          role: (activeRole as ApiUser["role"]) || undefined,
          status: (activeStatus as ApiUser["status"]) || undefined,
        });
        setUsers(result);
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải danh sách người dùng."
        );
      } finally {
        setLoadingUsers(false);
      }
    },
    [keyword, roleFilter, statusFilter]
  );

  /**
   * Hook kiểm tra quyền truy cập: Chỉ tải dữ liệu khi tài khoản hiện tại có vai trò ADMIN
   */
  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Xử lý tìm kiếm khi người dùng nhấn nút "Tìm kiếm" hoặc nhấn phím Enter trên ô nhập liệu
   */
  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadUsers();
  }

  /**
   * Xử lý thay đổi vai trò: Cập nhật state roleFilter và gọi API tải lại dữ liệu tức thì
   */
  function handleRoleChange(newRole: ApiUser["role"] | "") {
    setRoleFilter(newRole);
    void loadUsers({ role: newRole });
  }

  /**
   * Xử lý thay đổi trạng thái: Cập nhật state statusFilter và gọi API tải lại dữ liệu tức thì
   */
  function handleStatusChange(newStatus: ApiUser["status"] | "") {
    setStatusFilter(newStatus);
    void loadUsers({ status: newStatus });
  }

  /**
   * Xử lý Đặt lại: Xóa trắng toàn bộ bộ lọc và tải lại danh sách đầy đủ ban đầu
   */
  function handleReset() {
    setKeyword("");
    setRoleFilter("");
    setStatusFilter("");
    void loadUsers({ keyword: "", role: "", status: "" });
  }

  /**
   * Xử lý tạo mới tài khoản người dùng bởi Quản trị viên
   * @param event - Sự kiện submit form
   */
  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Lưu tham chiếu form trước khi thực hiện gọi hàm async (tránh event.currentTarget bị null sau await)
    const form = event.currentTarget;
    const data = new FormData(form);
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
      form.reset();

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

      {/* Bộ lọc và Tìm kiếm người dùng */}
      <section className="rounded-xl border border-border bg-surface p-6 space-y-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-text">Bộ lọc & Tìm kiếm người dùng</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Tìm theo từ khóa (họ tên, email, SĐT) và phân loại theo vai trò, trạng thái.
            </p>
          </div>
          <span className="text-xs text-text-muted font-medium bg-surface-muted px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tổng cộng: {users.length} người dùng
          </span>
        </div>

        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Ô tìm kiếm từ khóa */}
          <div className="lg:col-span-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập tên, email hoặc số điện thoại..."
              className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Dropdown lọc theo Vai trò */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value as ApiUser["role"] | "")}
              className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary bg-surface text-text"
            >
              <option value="">Tất cả vai trò</option>
              <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>
          </div>

          {/* Dropdown lọc theo Trạng thái */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as ApiUser["status"] | "")}
              className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary bg-surface text-text"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động (ACTIVE)</option>
              <option value="LOCKED">Đã khóa (LOCKED)</option>
            </select>
          </div>

          {/* Nút Tìm kiếm & Đặt lại */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loadingUsers}
              className="flex-1 h-10 rounded-lg bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loadingUsers ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loadingUsers}
              className="h-10 rounded-lg border border-border px-3 text-sm font-semibold text-text-muted transition hover:bg-surface-muted disabled:opacity-60"
            >
              Đặt lại
            </button>
          </div>
        </form>
      </section>

      {/* Bảng hiển thị danh sách người dùng với các cột được căn chỉnh chuẩn */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-6 py-3.5">Họ và tên</th>
              <th className="px-6 py-3.5">Email / SĐT</th>
              <th className="px-6 py-3.5 text-center w-32">Vai trò</th>
              <th className="px-6 py-3.5 text-center w-36">Trạng thái</th>
              <th className="px-6 py-3.5 text-right w-36">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loadingUsers ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">
                  Không tìm thấy người dùng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id} className="hover:bg-surface-muted/40 transition">
                  {/* Họ tên người dùng */}
                  <td className="px-6 py-4 font-medium text-text">{item.fullName}</td>

                  {/* Địa chỉ Email và SĐT */}
                  <td className="px-6 py-4 text-text-muted truncate max-w-xs">
                    <div>{item.email}</div>
                    {item.phone ? (
                      <div className="text-xs text-text-muted/80">{item.phone}</div>
                    ) : null}
                  </td>

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

                  {/* Nhãn trạng thái tài khoản */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
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
