"use client";

import { useEffect, useState } from "react";
import { addressService } from "@/modules/user/address.service";
import { Button } from "@/components/ui/Button";
import type { Address } from "@/types/user.types";
import { AddAddressModal } from "./AddAddressModal";

export function AddressListTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const list = await addressService.getAddresses();
      setAddresses(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAddresses();
  }, []);

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Thiết lập mặc định thất bại.",
      );
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await addressService.deleteAddress(id);
      await fetchAddresses();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Xóa địa chỉ thất bại.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          Danh sách địa chỉ nhận hàng
        </h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Thêm địa chỉ mới
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-text-muted">
          Đang tải danh sách địa chỉ...
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-text-muted">Bạn chưa có địa chỉ nhận hàng nào.</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm địa chỉ ngay
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="relative rounded-xl border border-border bg-surface p-5 shadow-soft transition hover:border-border-strong flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text">
                    {addr.receiverName || addr.recipientName}
                  </span>
                  {addr.isDefault && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mb-1">
                  📞 SĐT: {addr.receiverPhone || addr.phone}
                </p>
                <p className="text-sm text-text">
                  📍 {addr.streetDetail || addr.streetAddress}, {addr.ward},{" "}
                  {addr.district}, {addr.province}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    className="text-xs font-medium text-primary hover:underline transition"
                  >
                    Thiết lập mặc định
                  </button>
                ) : (
                  <span className="text-xs text-text-muted italic">
                    Địa chỉ nhận hàng chính
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
                >
                  Xóa địa chỉ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AddAddressModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAddresses}
      />
    </div>
  );
}
