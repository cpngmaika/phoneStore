import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { Coupon } from "@/types/coupon.types";

export function getAvailableCoupons() {
  return requestData<Coupon[]>(apiEndpoints.coupons);
}
