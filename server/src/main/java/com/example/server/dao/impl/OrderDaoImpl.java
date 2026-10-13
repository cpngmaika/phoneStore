package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.OrderDao;
import com.example.server.model.Order;
import com.example.server.model.enums.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;

import java.util.List;

public class OrderDaoImpl extends BaseDao<Order, Long> implements OrderDao {

    public OrderDaoImpl() {
        super(Order.class);
    }

    @Override
    public List<Order> findAllWithAmount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Order> cq = cb.createQuery(Order.class);
            Root<Order> order = cq.from(Order.class);

            order.fetch("payments", JoinType.LEFT);
            cq.select(order).distinct(true);

            TypedQuery<Order> query = em.createQuery(cq);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public Order findByOrderNumber(String orderNumber) {
        if (orderNumber == null || orderNumber.trim().isEmpty()) {
            return null;
        }

        EntityManager em = getEntityManager();
        try {
            TypedQuery<Order> query = em.createQuery(
                    "SELECT o FROM Order o WHERE o.orderNumber = :orderNumber",
                    Order.class
            );
            query.setParameter("orderNumber", orderNumber.trim());

            List<Order> orders = query.getResultList();
            return orders.isEmpty() ? null : orders.get(0);
        } finally {
            em.close();
        }
    }

    @Override
    public Order findByOrderCode(String orderCode) {
        return findByOrderNumber(orderCode);
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        if (userId == null) {
            return List.of();
        }

        EntityManager em = getEntityManager();
        try {
            TypedQuery<Order> query = em.createQuery(
                    "SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.orderDate DESC",
                    Order.class
            );
            query.setParameter("userId", userId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean updateStatus(Long orderId, String status) {
        if (orderId == null || status == null || status.trim().isEmpty()) {
            return false;
        }

        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Order order = em.find(Order.class, orderId);
            if (order == null) {
                tx.rollback();
                return false;
            }

            order.setStatus(OrderStatus.valueOf(status.trim().toUpperCase()));
            tx.commit();
            return true;
        } catch (IllegalArgumentException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            return false;
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
