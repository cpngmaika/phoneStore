package com.example.server.dao;

import com.example.server.model.Payment;

import java.util.Optional;

public class PaymentDao extends BaseDao<Payment, Long> {

    public PaymentDao() {
        super(Payment.class);
    }

    public Optional<Payment> findByOrderId(Long orderId) {
        return Optional.empty();
    }
}
