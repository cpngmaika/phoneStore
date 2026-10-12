package com.example.server.dao;

import com.example.server.model.Coupon;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class CouponDao extends BaseDao<Coupon, Long> {

    public CouponDao() {
        super(Coupon.class);
    }

    // Tìm mã giảm giá theo mã code
    public Coupon findByCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        EntityManager em = getEntityManager();

        try {
            TypedQuery<Coupon> query = em.createQuery(
                    "SELECT c FROM Coupon c "
                            + "WHERE LOWER(c.code) = LOWER(:code)",
                    Coupon.class
            );

            query.setParameter("code", code.trim());

            List<Coupon> coupons = query.getResultList();

            if (coupons.isEmpty()) {
                return null;
            }

            return coupons.get(0);

        } finally {
            em.close();
        }
    }
}