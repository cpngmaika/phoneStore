package com.example.server.dto.admin;

import com.example.server.dto.order.OrderResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Dashboard statistics computed from existing orders, users and products.
 */
public class AdminStatsResponse {
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long cancelledOrders;
    private long totalUsers;
    private long productsInStock;
    private BigDecimal revenueToday = BigDecimal.ZERO;
    private BigDecimal revenueThisWeek = BigDecimal.ZERO;
    private BigDecimal revenueThisMonth = BigDecimal.ZERO;
    private List<DailyRevenue> dailyRevenue;
    private List<BestSeller> bestSellers;
    private List<OrderResponse> recentOrders;

    public AdminStatsResponse() {
    }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getConfirmedOrders() { return confirmedOrders; }
    public void setConfirmedOrders(long confirmedOrders) { this.confirmedOrders = confirmedOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getProductsInStock() { return productsInStock; }
    public void setProductsInStock(long productsInStock) { this.productsInStock = productsInStock; }

    public BigDecimal getRevenueToday() { return revenueToday; }
    public void setRevenueToday(BigDecimal revenueToday) { this.revenueToday = revenueToday; }

    public BigDecimal getRevenueThisWeek() { return revenueThisWeek; }
    public void setRevenueThisWeek(BigDecimal revenueThisWeek) { this.revenueThisWeek = revenueThisWeek; }

    public BigDecimal getRevenueThisMonth() { return revenueThisMonth; }
    public void setRevenueThisMonth(BigDecimal revenueThisMonth) { this.revenueThisMonth = revenueThisMonth; }

    public List<DailyRevenue> getDailyRevenue() { return dailyRevenue; }
    public void setDailyRevenue(List<DailyRevenue> dailyRevenue) { this.dailyRevenue = dailyRevenue; }

    public List<BestSeller> getBestSellers() { return bestSellers; }
    public void setBestSellers(List<BestSeller> bestSellers) { this.bestSellers = bestSellers; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }

    public static class DailyRevenue {
        private String date;
        private BigDecimal revenue = BigDecimal.ZERO;

        public DailyRevenue() {
        }

        public DailyRevenue(String date, BigDecimal revenue) {
            this.date = date;
            this.revenue = revenue;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class BestSeller {
        private Long productId;
        private String productName;
        private long quantity;
        private BigDecimal revenue = BigDecimal.ZERO;

        public BestSeller() {
        }

        public BestSeller(Long productId, String productName, long quantity, BigDecimal revenue) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.revenue = revenue;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public long getQuantity() { return quantity; }
        public void setQuantity(long quantity) { this.quantity = quantity; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }
}
