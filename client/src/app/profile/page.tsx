"use client";


import { useEffect, useState } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import {
  addAddress,
  changePassword,
  deleteAddress,
  getAddresses,
  getProfile,
  updateProfile,
} from "@/api/users.service";
import type { ApiAddress, ApiUser } from "@/types/user.types";

export default function ProfilePage() {
  // State lưu trữ thông tin tài khoản người dùng
  const [profile, setProfile] = useState<ApiUser | null>(null);

  // State lưu danh sách địa chỉ nhận hàng của người dùng
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);

  // State biểu thị trạng thái đang tải dữ liệu ban đầu
  const [loading, setLoading] = useState(true);

  // State biểu thị trạng thái đang thực hiện một thao tác gửi yêu cầu (tránh bấm nhiều lần)
  const [busy, setBusy] = useState(false);

  // State lưu thông báo thành công hiển thị cho người dùng
  const [message, setMessage] = useState<string | null>(null);

  // State lưu thông báo lỗi nếu có phát sinh ngoại lệ
  const [error, setError] = useState<string | null>(null);

  /**
   * Tải lại toàn bộ dữ liệu hồ sơ và địa chỉ từ Backend
   */
  async function load() {
    const [currentProfile, currentAddresses] = await Promise.all([
      getProfile(),
      getAddresses(),
    ]);
    setProfile(currentProfile);
    setAddresses(currentAddresses);
  }

  /**
   * Hook nạp dữ liệu tự động ngay khi component được render lần đầu
   */
  useEffect(() => {
    let cancelled = false;

    // Gọi đồng thời cả 2 API để tối ưu tốc độ nạp trang
    Promise.all([getProfile(), getAddresses()])
      .then(([currentProfile, currentAddresses]) => {
        if (!cancelled) {
          setProfile(currentProfile);
          setAddresses(currentAddresses);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải dữ liệu hồ sơ người dùng.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Xử lý lưu cập nhật thông tin cá nhân (Họ tên, Số điện thoại)
   */
  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateProfile({
        fullName: String(data.get("fullName")),
        phone: String(data.get("phone")),
      });
      // Cập nhật State với dữ liệu mới từ Backend phản hồi
      setProfile(updated);
      setMessage("Thông tin hồ sơ đã được cập nhật thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể lưu thông tin hồ sơ.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý gửi yêu cầu đổi mật khẩu
   */
  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await changePassword({
        oldPassword: String(data.get("oldPassword")),
        newPassword: String(data.get("newPassword")),
      });
      // Đổi mật khẩu thành công -> reset các ô nhập trên Form
      form.reset();
      setMessage("Đổi mật khẩu tài khoản thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý thêm mới một địa chỉ giao hàng vào sổ địa chỉ
   */
  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Lưu tham chiếu form trước khi gọi hàm async
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await addAddress({
        receiverName: String(data.get("receiverName")),
        receiverPhone: String(data.get("receiverPhone")),
        country: String(data.get("country")),
        province: String(data.get("province")),
        district: String(data.get("district")),
        ward: String(data.get("ward")),
        streetDetail: String(data.get("streetDetail")),
        isDefault: data.get("isDefault") === "on",
      });
      form.reset();
      // Tải lại danh sách địa chỉ mới nhất
      await load();
      setMessage("Địa chỉ giao hàng mới đã được thêm thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể thêm địa chỉ mới.",
      );
    } finally {
      setBusy(false);
    }
  }

  /**
   * Xử lý xóa một địa chỉ giao hàng theo ID
   * @param id - Mã định danh của địa chỉ cần xóa
   */
  async function removeAddress(id: number) {
    setError(null);
    try {
      await deleteAddress(id);
      // Cập nhật State trực tiếp bằng cách lọc bỏ địa chỉ đã xóa
      setAddresses((current) => current.filter((address) => address.id !== id));
      setMessage("Đã xóa địa chỉ thành công.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể xóa địa chỉ.",
      );
    }
  }

  // Màn hình chờ khi đang nạp dữ liệu
  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-text-muted" role="status">
        Đang tải hồ sơ người dùng...
      </main>
    );
  }

  return (
    <ProfileView
      profile={profile}
      addresses={addresses}
      busy={busy}
      message={message}
      error={error}
      onSaveProfile={saveProfile}
      onChangePassword={handleChangePassword}
      onSaveAddress={saveAddress}
      onRemoveAddress={removeAddress}
    />
  );
}
