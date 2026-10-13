package com.example.server.dao;

import com.example.server.model.Payment;

import java.util.Optional;

public interface PaymentDao extends GenericDao<Payment, Long> {

    Payment findByOrderId(Long orderId);

    Optional<Payment> findOptionalByOrderId(Long orderId);

    Payment findByPaymentCode(String paymentCode);
}
