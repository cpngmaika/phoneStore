"use client";

import { useState } from "react";
import { userService } from "@/modules/user/user.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidPassword } from "@/utils/validation";

export function ChangePasswordTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!oldPassword.trim()) {
      setPasswordMessage({
        type: "error",
        text: "Vui lòng nhập mật khẩu hiện tại.",
      });
      return;
    }

    if (!isValidPassword(newPassword)) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự (không được chỉ chứa khoảng trắng).",
      });
      return;
    }

    if (newPassword === oldPassword) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới không được trùng với mật khẩu hiện tại.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      await userService.changePassword({ oldPassword, newPassword });
      setPasswordMessage({
        type: "success",
        text: "Đổi mật khẩu thành công!",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đổi mật khẩu thất bại.";
      setPasswordMessage({ type: "error", text: msg });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded-xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="text-lg font-bold text-text mb-4">Đổi mật khẩu</h2>

      {passwordMessage && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm font-medium ${
            passwordMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {passwordMessage.text}
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Mật khẩu hiện tại
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            disabled={passwordLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Mật khẩu mới
          </label>
          <Input
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={passwordLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Xác nhận mật khẩu mới
          </label>
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={passwordLoading}
          />
        </div>

        <Button
          type="submit"
          className="mt-2 w-full sm:w-auto"
          disabled={passwordLoading}
        >
          {passwordLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
