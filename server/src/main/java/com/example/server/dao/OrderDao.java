package com.example.server.dao;

import com.example.server.model.Order;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class OrderDao extends BaseDao<Order, Long> {

    public OrderDao() {
        super(Order.class);
    }

    // Tìm đơn hàng theo mã đơn hàng
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

    // Lấy danh sách đơn hàng của một người dùng
    public List<Order> findByUserId(Long userId) {
        if (userId == null) {
            return List.of();
        }

        EntityManager em = getEntityManager();

        try {
            TypedQuery<Order> query = em.createQuery(
                    "SELECT o FROM Order o "
                            + "WHERE o.user.id = :userId "
                            + "ORDER BY o.orderDate DESC",
                    Order.class
            );

            query.setParameter("userId", userId);

            return query.getResultList();

        } finally {
            em.close();
        }
    }

    // Cập nhật trạng thái đơn hàng
    public boolean updateStatus(Long orderId, String status) {
        if (orderId == null || status == null || status.trim().isEmpty()) {
            return false;
        }

        EntityManager em = getEntityManager();

        try {
            em.getTransaction().begin();

            Order order = em.find(Order.class, orderId);

            if (order == null) {
                em.getTransaction().rollback();
                return false;
            }

            order.setStatus(
                    com.example.server.model.enums.OrderStatus.valueOf(
                            status.trim().toUpperCase()
                    )
            );

            em.getTransaction().commit();
            return true;

        } catch (IllegalArgumentException e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return false;

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;

        } finally {
            em.close();
        }
    }
}