"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addAddress, deleteAddress, getAddresses, getProfile, updateProfile } from "@/api/users.service";
import type { ApiAddress, ApiUser } from "@/types/user.types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [currentProfile, currentAddresses] = await Promise.all([
      getProfile(),
      getAddresses(),
    ]);
    setProfile(currentProfile);
    setAddresses(currentAddresses);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProfile(), getAddresses()])
      .then(([currentProfile, currentAddresses]) => {
        if (!cancelled) {
          setProfile(currentProfile);
          setAddresses(currentAddresses);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Không thể tải hồ sơ.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      setProfile(updated);
      setMessage("Thông tin hồ sơ đã được lưu.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể lưu hồ sơ.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
      event.currentTarget.reset();
      await load();
      setMessage("Địa chỉ giao hàng đã được thêm.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể thêm địa chỉ.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAddress(id: number) {
    setError(null);
    try {
      await deleteAddress(id);
      setAddresses((current) => current.filter((address) => address.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể xóa địa chỉ.");
    }
  }

  if (loading) return <main className="mx-auto max-w-4xl px-5 py-16 text-text-muted" role="status">Đang tải hồ sơ...</main>;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <p className="text-sm font-semibold text-primary">Tài khoản</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Hồ sơ của tôi</h1>
        {profile ? <p className="mt-2 text-sm text-text-muted">{profile.email}</p> : null}
      </div>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">{message}</p> : null}
      {profile ? (
        <form onSubmit={saveProfile} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">Thông tin cá nhân</h2>
          <label className="block text-sm font-medium text-text">Họ và tên
            <input name="fullName" required defaultValue={profile.fullName} className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary" />
          </label>
          <label className="block text-sm font-medium text-text">Số điện thoại
            <input name="phone" defaultValue={profile.phone ?? ""} className="mt-2 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary" />
          </label>
          <button disabled={busy} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">Lưu hồ sơ</button>
          <Link href="/orders" className="ml-4 text-sm font-semibold text-primary">Xem đơn hàng</Link>
        </form>
      ) : null}
      <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-text">Địa chỉ giao hàng</h2>
        {addresses.map((address) => (
          <article key={address.id} className="flex items-start justify-between gap-4 rounded-lg bg-surface-muted p-4">
            <div className="text-sm text-text">
              <p className="font-semibold">{address.receiverName} · {address.receiverPhone}</p>
              <p className="mt-1 text-text-muted">{address.streetDetail}, {address.ward}, {address.district}, {address.province}, {address.country}</p>
              {address.isDefault ? <span className="mt-2 inline-block text-xs font-semibold text-primary">Mặc định</span> : null}
            </div>
            <button type="button" onClick={() => removeAddress(address.id)} className="text-sm font-semibold text-primary">Xóa</button>
          </article>
        ))}
        <form onSubmit={saveAddress} className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
          <h3 className="font-semibold text-text sm:col-span-2">Thêm địa chỉ</h3>
          <input name="receiverName" required placeholder="Người nhận" className="h-11 rounded-lg border border-border px-3" />
          <input name="receiverPhone" required placeholder="Số điện thoại" className="h-11 rounded-lg border border-border px-3" />
          <input name="country" required placeholder="Quốc gia" defaultValue="Vietnam" className="h-11 rounded-lg border border-border px-3" />
          <input name="province" required placeholder="Tỉnh / thành phố" className="h-11 rounded-lg border border-border px-3" />
          <input name="district" required placeholder="Quận / huyện" className="h-11 rounded-lg border border-border px-3" />
          <input name="ward" required placeholder="Phường / xã" className="h-11 rounded-lg border border-border px-3" />
          <input name="streetDetail" required placeholder="Số nhà, tên đường" className="h-11 rounded-lg border border-border px-3 sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" name="isDefault" /> Đặt làm địa chỉ mặc định</label>
          <button disabled={busy} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text disabled:opacity-60">Thêm địa chỉ</button>
        </form>
      </section>
    </main>
  );
}
