import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { Coupon } from "@/types/coupon.types";

export function getAvailableCoupons() {
  return requestData<Coupon[]>(apiEndpoints.coupons);
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
