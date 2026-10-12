"use client";

import { useState } from "react";
import { userService } from "@/modules/user/user.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AuthUser } from "@/types/auth.types";
import {
  cleanPhoneNumber,
  isValidFullName,
  isValidPhone,
  isValidUrl,
} from "@/utils/validation";

interface ProfileInfoTabProps {
  user: AuthUser;
  refreshUser: () => Promise<void>;
}

export function ProfileInfoTab({ user, refreshUser }: ProfileInfoTabProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);

    if (!isValidFullName(fullName)) {
      setInfoMessage({
        type: "error",
        text: "Họ và tên phải có ít nhất 2 ký tự.",
      });
      return;
    }

    if (phone.trim() && !isValidPhone(phone)) {
      setInfoMessage({
        type: "error",
        text: "Số điện thoại phải gồm 10 chữ số hợp lệ (VD: 0912345678).",
      });
      return;
    }

    if (avatarUrl.trim() && !isValidUrl(avatarUrl)) {
      setInfoMessage({
        type: "error",
        text: "Đường dẫn ảnh đại diện phải bắt đầu bằng http:// hoặc https://.",
      });
      return;
    }

    try {
      setInfoLoading(true);
      await userService.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      await refreshUser();
      setInfoMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cập nhật thất bại.";
      setInfoMessage({ type: "error", text: msg });
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded-xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="text-lg font-bold text-text mb-4">
        Cập nhật thông tin cá nhân
      </h2>

      {infoMessage && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm font-medium ${
            infoMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {infoMessage.text}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Email (không thể thay đổi)
          </label>
          <Input value={user.email} disabled className="opacity-60" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Họ và tên
          </label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={infoLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Số điện thoại
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(cleanPhoneNumber(e.target.value))}
            placeholder="0912345678"
            disabled={infoLoading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Đường dẫn ảnh đại diện (Avatar URL)
          </label>
          <div className="flex items-center gap-3 mb-2">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="h-12 w-12 rounded-full object-cover border border-border"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <Input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              disabled={infoLoading}
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-text-muted">Chọn nhanh ảnh mẫu:</span>
            <button
              type="button"
              onClick={() =>
                setAvatarUrl(
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                )
              }
              className="rounded bg-surface-muted px-2 py-0.5 text-xs text-text hover:bg-primary hover:text-white transition"
            >
              Nam 1
            </button>
            <button
              type="button"
              onClick={() =>
                setAvatarUrl(
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                )
              }
              className="rounded bg-surface-muted px-2 py-0.5 text-xs text-text hover:bg-primary hover:text-white transition"
            >
              Nữ 1
            </button>
            <button
              type="button"
              onClick={() =>
                setAvatarUrl(
                  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
                )
              }
              className="rounded bg-surface-muted px-2 py-0.5 text-xs text-text hover:bg-primary hover:text-white transition"
            >
              Nam 2
            </button>
            <button
              type="button"
              onClick={() =>
                setAvatarUrl(
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
                )
              }
              className="rounded bg-surface-muted px-2 py-0.5 text-xs text-text hover:bg-primary hover:text-white transition"
            >
              Nữ 2
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-2 w-full sm:w-auto"
          disabled={infoLoading}
        >
          {infoLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </div>
  );
}
