package com.example.server.service;

import com.example.server.dao.OrderDao;
import com.example.server.dao.PaymentDao;
import com.example.server.dao.impl.OrderDaoImpl;
import com.example.server.dao.impl.PaymentDaoImpl;
import com.example.server.dto.payment.PaymentResponse;
import com.example.server.model.Order;
import com.example.server.model.Payment;
import com.example.server.model.enums.OrderStatus;
import com.example.server.model.enums.PaymentMethod;
import com.example.server.model.enums.PaymentStatus;
import com.example.server.util.JpaUtil;
import io.github.cdimascio.dotenv.Dotenv;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PaymentService {

    private static final Pattern PAYMENT_CODE_PATTERN = Pattern.compile("PAY[A-Za-z0-9]{8}");

    private final OrderDao orderDao;
    private final PaymentDao paymentDao;
    private final Dotenv dotenv;

    public PaymentService() {
        this(new OrderDaoImpl(), new PaymentDaoImpl());
    }

    public PaymentService(OrderDao orderDao, PaymentDao paymentDao) {
        this.orderDao = orderDao;
        this.paymentDao = paymentDao;
        this.dotenv = initDotenv();
    }

    private Dotenv initDotenv() {
        try {
            return Dotenv.configure().ignoreIfMissing().load();
        } catch (Exception e) {
            try {
                return Dotenv.configure().directory("server").ignoreIfMissing().load();
            } catch (Exception ignored) {
                return null;
            }
        }
    }

    public PaymentResponse getOrCreatePayment(Long userId, Long orderId) {
        if (userId == null) {
            throw new SecurityException("User is not authenticated");
        }
        if (orderId == null) {
            throw new IllegalArgumentException("Invalid orderId");
        }

        Order order = orderDao.findById(orderId);
        if (order == null || order.getUser() == null || !userId.equals(order.getUser().getId())) {
            throw new SecurityException("Order not found or does not belong to user");
        }

        Payment existingPayment = paymentDao.findByOrderId(orderId);
        if (existingPayment != null) {
            return toResponse(existingPayment);
        }

        BigDecimal amount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
        Payment payment = new Payment(
                order,
                PaymentMethod.BANK_TRANSFER,
                amount
        );
        payment.setPaymentCode(generatePaymentCode());
        payment.setStatus(PaymentStatus.PENDING);

        paymentDao.save(payment);

        return toResponse(payment);
    }

    public PaymentResponse getPaymentByOrderId(Long userId, Long orderId) {
        if (userId == null) {
            throw new SecurityException("User is not authenticated");
        }
        if (orderId == null) {
            throw new IllegalArgumentException("Invalid orderId");
        }

        Order order = orderDao.findById(orderId);
        if (order == null || order.getUser() == null || !userId.equals(order.getUser().getId())) {
            throw new SecurityException("Order not found or does not belong to user");
        }

        Payment payment = paymentDao.findByOrderId(orderId);
        if (payment == null) {
            return null;
        }

        return toResponse(payment);
    }

    public boolean processSepayWebhook(String authorizationHeader, String content, BigDecimal transferAmount) {
        String webhookToken = getEnv("SEPAY_WEBHOOK_TOKEN", null);

        if (webhookToken != null && !webhookToken.isBlank()) {
            if (authorizationHeader == null || !authorizationHeader.equals(webhookToken)) {
                throw new SecurityException("Unauthorized webhook call");
            }
        }

        String paymentCode = extractPaymentCode(content);
        if (paymentCode == null || transferAmount == null) {
            throw new IllegalArgumentException("Invalid webhook payload or payment code missing");
        }

        Payment payment = paymentDao.findByPaymentCode(paymentCode);
        if (payment == null) {
            throw new IllegalArgumentException("Payment not found with code: " + paymentCode);
        }
        if (payment.getStatus() == PaymentStatus.SUCCESS || payment.getPaidAt() != null) {
            return true; // Already processed
        }
        if (transferAmount.compareTo(payment.getAmount()) < 0) {
            throw new IllegalArgumentException("Transfer amount is less than payment amount");
        }

        JpaUtil.executeInTransaction(em -> {
            Payment managedPayment = em.find(Payment.class, payment.getId());
            if (managedPayment == null) {
                throw new IllegalStateException("Payment not found");
            }
            managedPayment.markAsPaid();

            Order managedOrder = em.find(Order.class, managedPayment.getOrder().getId());
            if (managedOrder == null) {
                throw new IllegalStateException("Order not found");
            }
            managedOrder.setStatus(OrderStatus.CONFIRMED);
            return null;
        });

        return true;
    }

    public PaymentResponse toResponse(Payment payment) {
        if (payment == null) {
            return null;
        }

        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder() != null ? payment.getOrder().getId() : null);
        response.setMethod(payment.getMethod());
        response.setStatus(payment.getStatus() != null ? payment.getStatus() : PaymentStatus.PENDING);
        response.setAmount(payment.getAmount());
        response.setPaidAt(payment.getPaidAt());
        response.setPaymentCode(payment.getPaymentCode());
        response.setQrUrl(buildSepayQrUrl(payment));
        return response;
    }

    public String buildSepayQrUrl(Payment payment) {
        String bankId = getEnv("BANK_ID", "BIDV");
        String bankAccount = getEnv("BANK_ACCOUNT", "0123456789");
        String amountStr = payment.getAmount() != null ? payment.getAmount().toPlainString() : "0";
        String code = payment.getPaymentCode() != null ? payment.getPaymentCode() : "";

        return "https://qr.sepay.vn/img"
                + "?bank=" + encode(bankId)
                + "&acc=" + encode(bankAccount)
                + "&amount=" + encode(amountStr)
                + "&des=" + encode(code);
    }

    public String extractPaymentCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }
        Matcher matcher = PAYMENT_CODE_PATTERN.matcher(content);
        return matcher.find() ? matcher.group() : null;
    }

    private String generatePaymentCode() {
        return "PAY" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }

    public String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        if (value != null && !value.isBlank()) {
            return value;
        }
        if (dotenv != null) {
            try {
                value = dotenv.get(key);
                if (value != null && !value.isBlank()) {
                    return value;
                }
            } catch (Exception ignored) {
            }
        }
        return defaultValue;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
