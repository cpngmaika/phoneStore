package com.example.server.dao;

import com.example.server.model.Coupon;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.time.LocalDate;

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

    public List<Coupon> findAvailableCoupons(LocalDate date) {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery(
                            "SELECT c FROM Coupon c "
                                    + "WHERE c.isActive = true "
                                    + "AND c.startDate <= :date "
                                    + "AND c.endDate >= :date "
                                    + "AND c.usageLimit > "
                                    + "(SELECT COUNT(o) FROM Order o WHERE o.coupon = c) "
                                    + "ORDER BY c.endDate ASC",
                            Coupon.class
                    )
                    .setParameter("date", date)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public void deleteAndUnlinkOrders(Coupon coupon) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Coupon managedCoupon = em.find(Coupon.class, coupon.getId());
            if (managedCoupon != null) {
                em.createQuery("UPDATE Order o SET o.coupon = NULL WHERE o.coupon = :coupon")
                        .setParameter("coupon", managedCoupon)
                        .executeUpdate();
                em.remove(managedCoupon);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}