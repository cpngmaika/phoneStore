"use client";

import { useState } from "react";
import { adminUserService } from "@/modules/admin/admin-user.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { AdminUser, UserRole, UserStatus } from "@/types/user.types";
import {
  cleanPhoneNumber,
  isValidFullName,
  isValidPhone,
} from "@/utils/validation";

interface EditUserModalProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({
  user,
  open,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [editName, setEditName] = useState(user.fullName || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [editRole, setEditRole] = useState<UserRole>(user.role);
  const [editStatus, setEditStatus] = useState<UserStatus>(user.status);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!isValidFullName(editName)) {
      setEditError("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (editPhone.trim() && !isValidPhone(editPhone)) {
      setEditError("Số điện thoại không hợp lệ (phải gồm 10 chữ số).");
      return;
    }

    try {
      setEditLoading(true);
      await adminUserService.updateUser(user.id, {
        fullName: editName.trim(),
        phone: editPhone.trim() || undefined,
        role: editRole,
        status: editStatus,
      });

      onClose();
      onSuccess();
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : "Cập nhật tài khoản thất bại.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold text-text mb-4">
        Chỉnh sửa tài khoản #{user.id}
      </h2>

      {editError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
          {editError}
        </div>
      )}

      <form onSubmit={handleEditSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Email (không thể thay đổi)
          </label>
          <Input value={user.email} disabled className="opacity-60" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Họ và tên
          </label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Số điện thoại
          </label>
          <Input
            value={editPhone}
            onChange={(e) => setEditPhone(cleanPhoneNumber(e.target.value))}
            placeholder="0912345678"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Vai trò (Role)
          </label>
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as UserRole)}
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition focus:border-primary"
          >
            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
            <option value="STAFF">Nhân viên (STAFF)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Trạng thái (Status)
          </label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as UserStatus)}
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition focus:border-primary"
          >
            <option value="ACTIVE">Hoạt động (ACTIVE)</option>
            <option value="LOCKED">Bị khóa (LOCKED)</option>
            <option value="INACTIVE">Chưa kích hoạt (INACTIVE)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={editLoading}>
            {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
