
package com.example.server.dto.coupon;

import java.math.BigDecimal;

/**
 * DTO nhận dữ liệu khi người dùng kiểm tra mã giảm giá.
 */
public class CouponValidateRequest {

    private String code;
    private BigDecimal orderAmount;

    public CouponValidateRequest() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }
}
