"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/auth.context";
import {
  adminUserService,
  type UserFilterParams,
} from "@/modules/admin/admin-user.service";
import { Button } from "@/components/ui/Button";
import type { AdminUser, UserStatus } from "@/types/user.types";
import { UserFilterBar } from "./_components/UserFilterBar";
import { UserTable } from "./_components/UserTable";
import { CreateUserModal } from "./_components/CreateUserModal";
import { EditUserModal } from "./_components/EditUserModal";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentAdmin, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Fetch Users
  const fetchUsers = useCallback(async (params?: UserFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      const list = await adminUserService.getUsers(params);
      setUsers(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsersWithFilters = useCallback(() => {
    void fetchUsers({
      keyword: keyword.trim() || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    });
  }, [fetchUsers, keyword, roleFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    if (!authLoading) {
      if (!currentAdmin || currentAdmin.role !== "ADMIN") {
        router.push("/login");
      } else {
        adminUserService
          .getUsers()
          .then((list) => {
            if (!ignore) {
              setUsers(list);
              setLoading(false);
            }
          })
          .catch((err: unknown) => {
            if (!ignore) {
              setError(
                err instanceof Error ? err.message : "Không thể tải danh sách.",
              );
              setLoading(false);
            }
          });
      }
    }
    return () => {
      ignore = true;
    };
  }, [authLoading, currentAdmin, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refreshUsersWithFilters();
  };

  const handleResetSearch = () => {
    setKeyword("");
    setRoleFilter("");
    setStatusFilter("");
    void fetchUsers();
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus: UserStatus =
      user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const confirmMsg =
      nextStatus === "LOCKED"
        ? `Bạn có chắc muốn KHÓA tài khoản ${user.email}?`
        : `Bạn có chắc muốn MỞ KHÓA tài khoản ${user.email}?`;

    if (!confirm(confirmMsg)) return;

    try {
      await adminUserService.toggleStatus(user.id, nextStatus);
      refreshUsersWithFilters();
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Thay đổi trạng thái thất bại.",
      );
    }
  };

  if (authLoading || !currentAdmin || currentAdmin.role !== "ADMIN") {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-text-muted">Đang kiểm tra quyền Admin...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page Title */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Quản lý người dùng</h1>
          <p className="text-sm text-text-muted">
            Quản trị viên có thể xem danh sách, lọc, tạo tài khoản nhân viên và khóa/mở tài khoản.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          + Thêm tài khoản mới
        </Button>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={handleSearch}
        onReset={handleResetSearch}
      />

      {/* Error notification */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <UserTable
        users={users}
        loading={loading}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal Create */}
      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshUsersWithFilters}
      />

      {/* Modal Edit */}
      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          user={editingUser}
          open={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingUser(null);
          }}
          onSuccess={refreshUsersWithFilters}
        />
      )}
    </div>
  );
}
