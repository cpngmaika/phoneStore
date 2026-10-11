package com.example.server.dao.impl;

import com.example.server.model.Order;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.List;

public class OrderDAOImpl {

    public Order findById(Long id) {
        EntityManager em = DBConnection.getEntityManager();
        try {
            return em.find(Order.class, id);
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<Order> findAll() {
        EntityManager em = DBConnection.getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Order> cq = cb.createQuery(Order.class);
            Root<Order> root = cq.from(Order.class);
            cq.select(root);

            TypedQuery<Order> query = em.createQuery(cq);
            return query.getResultList();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public Order findByOrderCode(String orderCode) {
        EntityManager em = DBConnection.getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Order> cq = cb.createQuery(Order.class);
            Root<Order> root = cq.from(Order.class);

            // Điều kiện WHERE o.orderCode = orderCode
            cq.where(cb.equal(root.get("orderCode"), orderCode));

            TypedQuery<Order> query = em.createQuery(cq);
            return query.getResultStream().findFirst().orElse(null);
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    // 4. Cập nhật dữ liệu dùng em.merge() của JPA
    public void update(Order order) {
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(order);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }
}