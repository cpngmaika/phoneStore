package com.example.server.service;

import com.example.server.config.JPAConfig;
import com.example.server.controller.OrderServlet;
import com.example.server.dao.impl.ProductImageDaoImpl;
import com.example.server.dto.admin.AdminStatsResponse;
import com.example.server.dto.admin.AdminStatsResponse.BestSeller;
import com.example.server.dto.admin.AdminStatsResponse.DailyRevenue;
import com.example.server.dto.order.OrderResponse;
import com.example.server.model.Order;
import com.example.server.model.enums.OrderStatus;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Computes admin dashboard statistics with database-side aggregation queries.
 */
public class AdminStatsService {

    public AdminStatsResponse getStats() {
        EntityManager em = JPAConfig.getEntityManager();
        try {
            AdminStatsResponse stats = new AdminStatsResponse();
            stats.setTotalOrders(count(em, "SELECT COUNT(o) FROM Order o"));
            stats.setPendingOrders(countByStatus(em, OrderStatus.PENDING));
            stats.setConfirmedOrders(countByStatus(em, OrderStatus.CONFIRMED));
            stats.setCancelledOrders(countByStatus(em, OrderStatus.CANCELLED));
            stats.setTotalUsers(count(em, "SELECT COUNT(u) FROM User u"));
            stats.setProductsInStock(em.createQuery(
                            "SELECT COUNT(p) FROM Product p WHERE p.status = :status", Long.class)
                    .setParameter("status", ProductStatus.IN_STOCK)
                    .getSingleResult());

            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime startOfWeek = today
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .atStartOfDay();
            LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();

            stats.setTotalRevenue(revenueSince(em, null));
            stats.setRevenueToday(revenueSince(em, startOfDay));
            stats.setRevenueThisWeek(revenueSince(em, startOfWeek));
            stats.setRevenueThisMonth(revenueSince(em, startOfMonth));
            stats.setDailyRevenue(dailyRevenue(em, today.minusDays(6).atStartOfDay()));
            stats.setBestSellers(bestSellers(em, 5));
            stats.setRecentOrders(recentOrders(em, 5));
            return stats;
        } finally {
            em.close();
        }
    }

    private long count(EntityManager em, String jpql) {
        return em.createQuery(jpql, Long.class).getSingleResult();
    }

    private long countByStatus(EntityManager em, OrderStatus status) {
        return em.createQuery("SELECT COUNT(o) FROM Order o WHERE o.status = :status", Long.class)
                .setParameter("status", status)
                .getSingleResult();
    }

    private BigDecimal revenueSince(EntityManager em, LocalDateTime since) {
        String jpql = "SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status"
                + (since != null ? " AND o.orderDate >= :since" : "");
        TypedQuery<BigDecimal> query = em.createQuery(jpql, BigDecimal.class)
                .setParameter("status", OrderStatus.CONFIRMED);
        if (since != null) {
            query.setParameter("since", since);
        }
        BigDecimal value = query.getSingleResult();
        return value == null ? BigDecimal.ZERO : value;
    }

    private List<DailyRevenue> dailyRevenue(EntityManager em, LocalDateTime since) {
        List<Object[]> rows = em.createQuery(
                        "SELECT FUNCTION('DATE', o.orderDate), SUM(o.totalAmount) FROM Order o "
                                + "WHERE o.status = :status AND o.orderDate >= :since "
                                + "GROUP BY FUNCTION('DATE', o.orderDate)",
                        Object[].class)
                .setParameter("status", OrderStatus.CONFIRMED)
                .setParameter("since", since)
                .getResultList();

        Map<String, BigDecimal> byDate = new LinkedHashMap<>();
        for (Object[] row : rows) {
            if (row[0] == null) continue;
            BigDecimal revenue = row[1] == null ? BigDecimal.ZERO : (BigDecimal) row[1];
            byDate.put(String.valueOf(row[0]), revenue);
        }

        List<DailyRevenue> result = new ArrayList<>();
        LocalDate start = since.toLocalDate();
        for (int i = 0; i < 7; i++) {
            String key = start.plusDays(i).toString();
            result.add(new DailyRevenue(key, byDate.getOrDefault(key, BigDecimal.ZERO)));
        }
        return result;
    }

    private List<BestSeller> bestSellers(EntityManager em, int limit) {
        List<Object[]> rows = em.createQuery(
                        "SELECT li.product.id, li.product.name, SUM(li.quantity), "
                                + "SUM(li.unitPrice * li.quantity) "
                                + "FROM LineItem li WHERE li.order.status = :status "
                                + "GROUP BY li.product.id, li.product.name "
                                + "ORDER BY SUM(li.quantity) DESC",
                        Object[].class)
                .setParameter("status", OrderStatus.CONFIRMED)
                .setMaxResults(limit)
                .getResultList();

        List<BestSeller> list = new ArrayList<>();
        for (Object[] row : rows) {
            Long productId = row[0] == null ? null : ((Number) row[0]).longValue();
            String productName = (String) row[1];
            long quantity = row[2] == null ? 0 : ((Number) row[2]).longValue();
            BigDecimal revenue = row[3] == null ? BigDecimal.ZERO : (BigDecimal) row[3];
            list.add(new BestSeller(productId, productName, quantity, revenue));
        }
        return list;
    }

    private List<OrderResponse> recentOrders(EntityManager em, int limit) {
        List<Long> ids = em.createQuery(
                        "SELECT o.id FROM Order o ORDER BY o.orderDate DESC", Long.class)
                .setMaxResults(limit)
                .getResultList();
        if (ids.isEmpty()) {
            return List.of();
        }
        List<Order> orders = em.createQuery(
                        "SELECT DISTINCT o FROM Order o "
                                + "LEFT JOIN FETCH o.items i "
                                + "LEFT JOIN FETCH i.product "
                                + "LEFT JOIN FETCH o.coupon "
                                + "WHERE o.id IN :ids "
                                + "ORDER BY o.orderDate DESC",
                        Order.class)
                .setParameter("ids", ids)
                .getResultList();
        return OrderServlet.toResponseList(orders, new ProductImageDaoImpl());
    }
}
