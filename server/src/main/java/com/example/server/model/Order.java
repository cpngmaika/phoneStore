package com.example.server.model;

import com.example.server.model.enums.OrderStatus;
import java.util.List;
import java.util.ArrayList;
import com.example.server.model.Payment;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", unique = true, nullable = false)
    private String orderCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    // COI COI LẠI CHỖ NÀY
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "shipping_address_id")
    private Long shippingAddressId;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getShippingAddressId() { return shippingAddressId; }
    public void setShippingAddressId(Long shippingAddressId) { this.shippingAddressId = shippingAddressId; }
}
