
package com.example.server.model;

import com.example.server.model.enums.CouponType;
import jakarta.persistence.*;
<<<<<<< HEAD
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
=======

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "coupons",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_coupons_code",
                        columnNames = "code"
                )
        }
)
>>>>>>> origin/main
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
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

=======
    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private CouponType discountType;

    @Column(
            name = "discount_value",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal discountValue;

    @Column(
            name = "min_order_amount",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal minOrderAmount;

    @Column(
            name = "max_discount_amount",
            precision = 15,
            scale = 2
    )
    private BigDecimal maxDiscountAmount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "coupon")
    private List<Order> orders = new ArrayList<>();

    protected Coupon() {
    }

    public Coupon(
            String code,
            CouponType discountType,
            BigDecimal discountValue,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscountAmount,
            LocalDate startDate,
            LocalDate endDate,
            Integer usageLimit,
            Boolean isActive
    ) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.usageLimit = usageLimit;
        this.isActive = isActive;
    }

    public boolean isValid(BigDecimal orderAmount) {
        if (Boolean.FALSE.equals(isActive)) {
            return false;
        }
        LocalDate now = LocalDate.now();
        if (startDate != null && now.isBefore(startDate)) {
            return false;
        }
        if (endDate != null && now.isAfter(endDate)) {
            return false;
        }
        if (minOrderAmount != null && orderAmount != null && orderAmount.compareTo(minOrderAmount) < 0) {
            return false;
        }
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isValid(orderAmount) || orderAmount == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (discountType == CouponType.PERCENTAGE) {
            discount = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else if (discountType == CouponType.FIXED_AMOUNT) {
            discount = discountValue;
        }

        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }

>>>>>>> origin/main
    public Long getId() {
        return id;
    }

<<<<<<< HEAD
    public void setId(Long id) {
        this.id = id;
    }

=======
>>>>>>> origin/main
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

<<<<<<< HEAD
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
=======
    public CouponType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(CouponType discountType) {
        this.discountType = discountType;
>>>>>>> origin/main
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

<<<<<<< HEAD
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
=======
    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }

    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) {
        this.maxDiscountAmount = maxDiscountAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
>>>>>>> origin/main
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

<<<<<<< HEAD
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
=======
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<Order> getOrders() {
        return orders;
    }
}
>>>>>>> origin/main
