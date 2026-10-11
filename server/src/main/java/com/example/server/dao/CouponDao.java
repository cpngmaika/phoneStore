package com.example.server.dao;

import com.example.server.model.Coupon;

import java.util.Optional;

public class CouponDao extends BaseDao<Coupon, Long> {

    public CouponDao() {
        super(Coupon.class);
    }

    public Optional<Coupon> findByCode(String code) {
        return Optional.empty();
    }
}
