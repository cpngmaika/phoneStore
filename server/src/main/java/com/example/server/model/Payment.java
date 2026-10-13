package com.example.server.model;

import com.example.server.model.enums.PaymentMethod;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Giu ManyToOne de phu hop voi Order.payments
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private com.example.server.model.enums.PaymentStatus status = com.example.server.model.enums.PaymentStatus.PENDING;

    @Column(
            name = "amount",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal amount;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // Ma giao dich / ma thanh toan dung cho SePay
    @Column(name = "payment_code", unique = true)
    private String paymentCode;

    public Payment() {
    }

    public Payment(
            Order order,
            PaymentMethod method,
            BigDecimal amount
    ) {
        this.order = order;
        this.method = method;
        this.amount = amount;
        this.status = com.example.server.model.enums.PaymentStatus.PENDING;
    }

    public void markAsPaid() {
        this.status = com.example.server.model.enums.PaymentStatus.SUCCESS;
        this.paidAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getPaymentCode() {
        return paymentCode;
    }

    public void setPaymentCode(String paymentCode) {
        this.paymentCode = paymentCode;
    }

    public com.example.server.model.enums.PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(com.example.server.model.enums.PaymentStatus status) {
        this.status = status;
    }
}