"use client";

import { useState } from "react";
import { adminUserService } from "@/modules/admin/admin-user.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { UserRole } from "@/types/user.types";
import {
  cleanPhoneNumber,
  isValidEmail,
  isValidFullName,
  isValidPassword,
  isValidPhone,
} from "@/utils/validation";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createRole, setCreateRole] = useState<UserRole>("STAFF");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const resetForm = () => {
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreatePhone("");
    setCreateRole("STAFF");
    setCreateError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!isValidFullName(createName)) {
      setCreateError("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (!isValidEmail(createEmail)) {
      setCreateError("Email không đúng định dạng.");
      return;
    }

    if (!isValidPassword(createPassword)) {
      setCreateError("Mật khẩu phải có ít nhất 6 ký tự (không được chỉ chứa khoảng trắng).");
      return;
    }

    if (createPhone.trim() && !isValidPhone(createPhone)) {
      setCreateError("Số điện thoại không hợp lệ (phải gồm 10 chữ số).");
      return;
    }

    try {
      setCreateLoading(true);
      await adminUserService.createUser({
        fullName: createName.trim(),
        email: createEmail.trim(),
        password: createPassword,
        phone: createPhone.trim() || undefined,
        role: createRole,
      });

      handleClose();
      onSuccess();
    } catch (err: unknown) {
      setCreateError(
        err instanceof Error ? err.message : "Tạo tài khoản thất bại.",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 className="text-lg font-bold text-text mb-4">
        Tạo tài khoản người dùng mới
      </h2>

      {createError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
          {createError}
        </div>
      )}

      <form onSubmit={handleCreateSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <Input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Email đăng nhập <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
            placeholder="staff@store.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Mật khẩu khởi tạo <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            value={createPassword}
            onChange={(e) => setCreatePassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Số điện thoại
          </label>
          <Input
            value={createPhone}
            onChange={(e) => setCreatePhone(cleanPhoneNumber(e.target.value))}
            placeholder="0912345678"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Vai trò (Role)
          </label>
          <select
            value={createRole}
            onChange={(e) => setCreateRole(e.target.value as UserRole)}
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text outline-none transition focus:border-primary"
          >
            <option value="STAFF">Nhân viên (STAFF)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={createLoading}>
            {createLoading ? "Đang tạo..." : "Tạo tài khoản"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
