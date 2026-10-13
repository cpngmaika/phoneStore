package com.example.server.model;

import com.example.server.model.enums.OrderStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    // Ma don hang
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ma don hang hien thi
    @Column(name = "order_number", unique = true)
    private String orderNumber;

    // Trang thai don hang
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status = OrderStatus.PENDING;

    // Tong tien don hang sau khi ap dung giam gia
    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    // Ngay tao don hang
    @Column(name = "order_date")
    private LocalDateTime orderDate;

    // Nguoi dat hang
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Ma giam gia duoc ap dung cho don hang
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    // Danh sach san pham trong don hang
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<LineItem> items = new ArrayList<>();

    // Danh sach thanh toan cua don hang
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    // Constructor mac dinh cho JPA
    public Order() {
    }

    // Constructor tao don hang
    public Order(String orderNumber, User user) {
        this.orderNumber = orderNumber;
        this.user = user;
    }

    // Them san pham vao don hang
    public void addLineItem(LineItem item) {
        if (item == null) {
            return;
        }

        items.add(item);
        item.setOrder(this);
    }

    // Xoa san pham khoi don hang
    public void removeLineItem(LineItem item) {
        if (item == null) {
            return;
        }

        items.remove(item);
        item.setOrder(null);
    }

    // Tinh tong tien cac san pham
    public void calculateTotal() {
        this.totalAmount = items.stream()
                .map(LineItem::getSubtotal)
                .filter(subtotal -> subtotal != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getter va Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public List<LineItem> getItems() {
        return items;
    }

    public void setItems(List<LineItem> items) {
        this.items = items;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}