package com.example.server.dto.coupon;

import java.math.BigDecimal;

/**
 * Result of validating a coupon against a given order amount.
 */
public class CouponValidationResponse {
    private String code;
    private BigDecimal orderAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;

    public CouponValidationResponse() {
    }

    public CouponValidationResponse(
            String code,
            BigDecimal orderAmount,
            BigDecimal discountAmount,
            BigDecimal finalAmount
    ) {
        this.code = code;
        this.orderAmount = orderAmount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getOrderAmount() { return orderAmount; }
    public void setOrderAmount(BigDecimal orderAmount) { this.orderAmount = orderAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
}
