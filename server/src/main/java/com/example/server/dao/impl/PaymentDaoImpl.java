package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.PaymentDao;
import com.example.server.model.Payment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import java.util.List;
import java.util.Optional;

public class PaymentDaoImpl extends BaseDao<Payment, Long> implements PaymentDao {

    public PaymentDaoImpl() {
        super(Payment.class);
    }

    @Override
    public Payment findByOrderId(Long orderId) {
        if (orderId == null) {
            return null;
        }
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Payment> cq = cb.createQuery(Payment.class);
            Root<Payment> root = cq.from(Payment.class);

            cq.where(cb.equal(root.get("order").get("id"), orderId));

            TypedQuery<Payment> query = em.createQuery(cq);
            List<Payment> results = query.getResultList();
            return results.isEmpty() ? null : results.get(0);
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<Payment> findOptionalByOrderId(Long orderId) {
        return Optional.ofNullable(findByOrderId(orderId));
    }

    @Override
    public Payment findByPaymentCode(String paymentCode) {
        if (paymentCode == null || paymentCode.trim().isEmpty()) {
            return null;
        }
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Payment> cq = cb.createQuery(Payment.class);
            Root<Payment> root = cq.from(Payment.class);

            cq.where(cb.equal(root.get("paymentCode"), paymentCode.trim()));

            TypedQuery<Payment> query = em.createQuery(cq);
            List<Payment> results = query.getResultList();
            return results.isEmpty() ? null : results.get(0);
        } finally {
            em.close();
        }
    }
}
