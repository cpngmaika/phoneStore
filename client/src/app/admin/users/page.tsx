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
import { AdminUsersControls } from "@/components/admin/AdminUsersControls";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      <AdminUsersControls
        busy={busy}
        loading={loadingUsers}
        keyword={keyword}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        totalUsers={users.length}
        onCreate={createUser}
        onSearch={handleSearch}
        onKeywordChange={setKeyword}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onReset={handleReset}
      />

      <AdminUsersTable
        users={users}
        loading={loadingUsers}
        onToggleStatus={toggleStatus}
      />
    </main>
  );
}
