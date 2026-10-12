package com.example.server.dao.impl;

import com.example.server.model.Payment;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

public class PaymentDAOImpl {

    // 1. Lưu mới một giao dịch (Create)
    public void save(Payment payment) {
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(payment);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            e.printStackTrace();
        } finally {
            if (em != null) em.close();
        }
    }

    public void update(Payment payment) {
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            // Hàm merge() của JPA sẽ cập nhật dữ liệu của entity xuống DB
            em.merge(payment);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            e.printStackTrace();
        } finally {
            if (em != null) em.close();
        }
    }

    // 3. Tìm Payment theo ID đơn hàng bằng Criteria API
    public Payment findByOrderId(Long orderId) {
        EntityManager em = DBConnection.getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Payment> cq = cb.createQuery(Payment.class);
            Root<Payment> root = cq.from(Payment.class);

            cq.where(cb.equal(root.get("order").get("id"), orderId));

            return em.createQuery(cq).getResultStream().findFirst().orElse(null);
        } finally {
            if (em != null) em.close();
        }
    }

    // 4. Tìm Payment theo Mã thanh toán (paymentCode) bằng Criteria API
    public Payment findByPaymentCode(String paymentCode) {
        EntityManager em = DBConnection.getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Payment> cq = cb.createQuery(Payment.class);
            Root<Payment> root = cq.from(Payment.class);

            cq.where(cb.equal(root.get("paymentCode"), paymentCode));

            return em.createQuery(cq).getResultStream().findFirst().orElse(null);
        } finally {
            if (em != null) em.close();
        }
    }
}
