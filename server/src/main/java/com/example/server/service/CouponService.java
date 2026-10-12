
package com.example.server.service;

import com.example.server.dao.CouponDao;
import com.example.server.model.Coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Xử lý nghiệp vụ mã giảm giá.
 */
public class CouponService {

    private final CouponDao couponDao;

    public CouponService() {
        this.couponDao = new CouponDao();
    }

    /**
     * Kiểm tra mã giảm giá và trả về số tiền được giảm.
     */
    public BigDecimal validateAndCalculateDiscount(
            String code,
            BigDecimal orderAmount
    ) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập mã giảm giá.");
        }

        if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá trị đơn hàng không hợp lệ.");
        }

        Optional<Coupon> optionalCoupon = couponDao.findByCode(code);

        if (optionalCoupon.isEmpty()) {
            throw new IllegalArgumentException("Mã giảm giá không tồn tại.");
        }

        Coupon coupon = optionalCoupon.get();

        if (!coupon.isValidAt(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Mã giảm giá không còn hiệu lực hoặc đã hết lượt sử dụng."
            );
        }

        return coupon.tinhTienGiam(orderAmount);
    }

    /**
     * Tìm mã giảm giá theo code.
     */
    public Optional<Coupon> findByCode(String code) {
        return couponDao.findByCode(code);
    }
}
