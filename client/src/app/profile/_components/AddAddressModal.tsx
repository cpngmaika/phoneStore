"use client";

import { useState } from "react";
import { addressService } from "@/modules/user/address.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  cleanPhoneNumber,
  isValidFullName,
  isValidPhone,
} from "@/utils/validation";

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function AddAddressModal({
  open,
  onClose,
  onSuccess,
}: AddAddressModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const resetForm = () => {
    setRecipientName("");
    setAddrPhone("");
    setProvince("");
    setDistrict("");
    setWard("");
    setStreetAddress("");
    setIsDefault(false);
    setModalError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!isValidFullName(recipientName)) {
      setModalError("Tên người nhận phải có ít nhất 2 ký tự.");
      return;
    }

    if (!isValidPhone(addrPhone)) {
      setModalError("Số điện thoại người nhận phải gồm 10 chữ số hợp lệ (VD: 0912345678).");
      return;
    }

    if (
      !province.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !streetAddress.trim()
    ) {
      setModalError("Vui lòng điền đầy đủ tất cả các trường địa chỉ.");
      return;
    }

    try {
      setModalLoading(true);
      await addressService.addAddress({
        receiverName: recipientName.trim(),
        receiverPhone: addrPhone.trim(),
        recipientName: recipientName.trim(),
        phone: addrPhone.trim(),
        country: "Vietnam",
        province: province.trim(),
        district: district.trim(),
        ward: ward.trim(),
        streetDetail: streetAddress.trim(),
        streetAddress: streetAddress.trim(),
        isDefault,
      });

      handleClose();
      await onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thêm địa chỉ thất bại.";
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 className="text-lg font-bold text-text mb-4">
        Thêm địa chỉ nhận hàng mới
      </h2>

      {modalError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
          {modalError}
        </div>
      )}

      <form onSubmit={handleAddAddress} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Tên người nhận <span className="text-red-500">*</span>
            </label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              value={addrPhone}
              onChange={(e) => setAddrPhone(cleanPhoneNumber(e.target.value))}
              placeholder="VD: 0912345678"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Tỉnh / Thành <span className="text-red-500">*</span>
            </label>
            <Input
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Hồ Chí Minh"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Quận / Huyện <span className="text-red-500">*</span>
            </label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Quận 1"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text">
              Phường / Xã <span className="text-red-500">*</span>
            </label>
            <Input
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="Bến Nghé"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text">
            Địa chỉ chi tiết (Số nhà, tên đường){" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="VD: 123 Lê Lợi"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded text-primary focus:ring-primary"
          />
          <label htmlFor="isDefault" className="text-xs text-text">
            Đặt làm địa chỉ nhận hàng mặc định
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={modalLoading}>
            {modalLoading ? "Đang thêm..." : "Thêm địa chỉ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
