export type Coupon = {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
};

export type CouponValidation = {
  code: string;
  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
};
