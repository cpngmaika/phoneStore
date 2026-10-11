
package com.example.server.model;

import com.example.server.model.enums.CouponType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_type", nullable = false)
    private CouponType couponType;

    @Column(name = "discount_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "minimum_order_amount", precision = 12, scale = 2)
    private BigDecimal minimumOrderAmount;

    @Column(name = "maximum_discount_amount", precision = 12, scale = 2)
    private BigDecimal maximumDiscountAmount;

    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public Coupon() {
    }

    public boolean isValidAt(LocalDateTime thoiGian) {
        if (!active) {
            return false;
        }

        if (startAt != null && thoiGian.isBefore(startAt)) {
            return false;
        }

        if (endAt != null && thoiGian.isAfter(endAt)) {
            return false;
        }

        if (usageLimit != null && usedCount >= usageLimit) {
            return false;
        }

        return true;
    }

    public BigDecimal tinhTienGiam(BigDecimal tongTien) {
        if (tongTien == null || tongTien.signum() < 0) {
            throw new IllegalArgumentException("Tổng tiền không hợp lệ");
        }

        if (discountValue == null || discountValue.signum() <= 0) {
            throw new IllegalStateException("Giá trị giảm giá không hợp lệ");
        }

        if (minimumOrderAmount != null
                && tongTien.compareTo(minimumOrderAmount) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal tienGiam;

        if (couponType == CouponType.PERCENTAGE) {
            if (discountValue.compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalStateException(
                        "Phần trăm giảm giá không được vượt quá 100");
            }

            tienGiam = tongTien.multiply(discountValue)
                    .divide(new BigDecimal("100"), 2,
                            java.math.RoundingMode.HALF_UP);

        } else if (couponType == CouponType.FIXED_AMOUNT) {
            tienGiam = discountValue;
        } else {
            throw new IllegalStateException("Loại coupon không hợp lệ");
        }

        if (maximumDiscountAmount != null
                && tienGiam.compareTo(maximumDiscountAmount) > 0) {
            tienGiam = maximumDiscountAmount;
        }

        if (tienGiam.compareTo(tongTien) > 0) {
            tienGiam = tongTien;
        }

        return tienGiam;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CouponType getCouponType() {
        return couponType;
    }

    public void setCouponType(CouponType couponType) {
        this.couponType = couponType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinimumOrderAmount() {
        return minimumOrderAmount;
    }

    public void setMinimumOrderAmount(BigDecimal minimumOrderAmount) {
        this.minimumOrderAmount = minimumOrderAmount;
    }

    public BigDecimal getMaximumDiscountAmount() {
        return maximumDiscountAmount;
    }

    public void setMaximumDiscountAmount(BigDecimal maximumDiscountAmount) {
        this.maximumDiscountAmount = maximumDiscountAmount;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
