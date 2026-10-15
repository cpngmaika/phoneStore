
package com.example.server.service;

import com.example.server.dao.CouponDao;
import com.example.server.model.Coupon;
import com.example.server.model.enums.CouponType;
import com.example.server.dto.coupon.CouponResponse;
import com.example.server.dto.coupon.CouponRequest;

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
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CouponResponse> getAllCoupons() {
        return couponDao.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CouponResponse createCoupon(CouponRequest request) {
        validateRequest(request);
        Coupon coupon = new Coupon(
                normalizeCode(request.getCode()),
                request.getDiscountType(),
                request.getDiscountValue(),
                request.getMinOrderAmount(),
                request.getMaxDiscountAmount(),
                request.getStartDate(),
                request.getEndDate(),
                request.getUsageLimit(),
                request.getIsActive() == null || request.getIsActive()
        );
        return toResponse(couponDao.save(coupon));
    }

    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        validateRequest(request);
        Coupon coupon = couponDao.findById(id);
        if (coupon == null) {
            throw new IllegalArgumentException("Không tìm thấy mã giảm giá.");
        }
        coupon.setCode(normalizeCode(request.getCode()));
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toResponse(couponDao.update(coupon));
    }

    public void deleteCoupon(Long id) {
        Coupon coupon = couponDao.findById(id);
        if (coupon == null) {
            throw new IllegalArgumentException("Không tìm thấy mã giảm giá.");
        }
        couponDao.deleteAndUnlinkOrders(coupon);
    }

    private void validateRequest(CouponRequest request) {
        if (request == null || request.getCode() == null || request.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã giảm giá không được để trống.");
        }
        if (request.getCode().trim().length() > 50) {
            throw new IllegalArgumentException("Mã giảm giá tối đa 50 ký tự.");
        }
        if (request.getDiscountType() == null || request.getDiscountValue() == null
                || request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Loại và giá trị giảm giá không hợp lệ.");
        }
        if (request.getMinOrderAmount() == null
                || request.getMinOrderAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá trị đơn hàng tối thiểu không hợp lệ.");
        }
        if (request.getMaxDiscountAmount() != null
                && request.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Mức giảm tối đa phải lớn hơn 0.");
        }
        if (request.getStartDate() == null || request.getEndDate() == null
                || request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("Khoảng thời gian mã giảm giá không hợp lệ.");
        }
        if (request.getUsageLimit() == null || request.getUsageLimit() <= 0) {
            throw new IllegalArgumentException("Số lượt sử dụng phải lớn hơn 0.");
        }
        if (request.getDiscountType() == CouponType.PERCENTAGE
                && request.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Mức giảm phần trăm không được vượt quá 100%.");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    private CouponResponse toResponse(Coupon coupon) {
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
    }
}
