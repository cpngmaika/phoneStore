import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { Coupon, CouponValidation } from "@/types/coupon.types";

export function getAvailableCoupons() {
  return requestData<Coupon[]>(apiEndpoints.coupons);
}

export function validateCoupon(payload: { code: string; orderAmount: number }) {
  return requestData<CouponValidation>(`${apiEndpoints.coupons}/validate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type CouponRequest = Omit<Coupon, "id">;

export function getAdminCoupons() {
  return requestData<Coupon[]>(apiEndpoints.admin.coupons);
}

export function createCoupon(payload: CouponRequest) {
  return requestData<Coupon>(apiEndpoints.admin.coupons, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCoupon(id: number, payload: CouponRequest) {
  return requestData<Coupon>(apiEndpoints.admin.coupon(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCoupon(id: number) {
  return requestData<null>(apiEndpoints.admin.coupon(id), {
    method: "DELETE",
  });
}
