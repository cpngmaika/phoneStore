
package com.example.server.service;

import com.example.server.dao.CouponDao;
import com.example.server.model.Coupon;
import com.example.server.dto.coupon.CouponResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        Coupon coupon = couponDao.findByCode(code);
        if (coupon == null) {
            throw new IllegalArgumentException("Mã giảm giá không tồn tại.");
        }

        if (!coupon.isValid(orderAmount)) {
            throw new IllegalArgumentException(
                    "Mã giảm giá không còn hiệu lực hoặc đã hết lượt sử dụng."
            );
        }

        return coupon.calculateDiscount(orderAmount);
    }

    /**
     * Tìm mã giảm giá theo code.
     */
    public Optional<Coupon> findByCode(String code) {
        return Optional.ofNullable(couponDao.findByCode(code));
    }

    public List<CouponResponse> getAvailableCoupons() {
        return couponDao.findAvailableCoupons(LocalDate.now()).stream()
                .map(coupon -> {
                    CouponResponse response = new CouponResponse();
                    response.setId(coupon.getId());
                    response.setCode(coupon.getCode());
                    response.setDiscountType(coupon.getDiscountType());
                    response.setDiscountValue(coupon.getDiscountValue());
                    response.setMinOrderAmount(coupon.getMinOrderAmount());
                    response.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
                    response.setStartDate(coupon.getStartDate());
                    response.setEndDate(coupon.getEndDate());
                    response.setIsActive(coupon.getIsActive());
                    response.setUsageLimit(coupon.getUsageLimit());
                    return response;
                })
                .collect(Collectors.toList());
    }
}
