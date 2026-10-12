"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/modules/auth/auth.context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  cleanPhoneNumber,
  isValidEmail,
  isValidFullName,
  isValidPassword,
  isValidPhone,
} from "@/utils/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isValidFullName(fullName)) {
      setError("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không đúng định dạng (VD: example@mail.com).");
      return;
    }

    if (phone.trim() && !isValidPhone(phone)) {
      setError("Số điện thoại phải gồm 10 chữ số hợp lệ (VD: 0912345678).");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Mật khẩu phải có ít nhất 6 ký tự (không được chỉ chứa khoảng trắng).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            P
          </span>
          <h1 className="mt-4 text-2xl font-bold text-text">Tạo tài khoản mới</h1>
          <p className="mt-1 text-sm text-text-muted">
            Trở thành thành viên của PhoneStore để nhận nhiều ưu đãi
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Số điện thoại
            </label>
            <Input
              type="tel"
              placeholder="0912345678"
              value={phone}
              onChange={(e) => setPhone(cleanPhoneNumber(e.target.value))}
              disabled={loading}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-base mt-2"
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
