package com.example.server.controller;

import com.example.server.dao.OrderDao;
import com.example.server.dao.PaymentDao;
import com.example.server.dao.impl.OrderDaoImpl;
import com.example.server.dao.impl.PaymentDaoImpl;
import com.example.server.model.Order;
import com.example.server.model.Payment;
import com.example.server.model.User;
import com.example.server.model.enums.OrderStatus;
import com.example.server.model.enums.PaymentMethod;
import com.example.server.util.JpaUtil;
import com.example.server.util.SessionUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/api/payment/*")
public class PaymentServlet extends HttpServlet {
    private static final Pattern PAYMENT_CODE_PATTERN = Pattern.compile("PAY[A-Za-z0-9]{8}");

    private final OrderDao orderDAO = new OrderDaoImpl();
    private final PaymentDao paymentDAO = new PaymentDaoImpl();
    private final Dotenv dotenv = Dotenv.configure()
            .directory("C:/Users/hp/projects/app/phoneStore/server")
            .load();
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        prepareJsonResponse(resp);

        try {
            if (!"/check".equals(req.getPathInfo())) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
                return;
            }

            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser == null) {
                writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            Long orderId = parseOrderId(req);
            if (orderId == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid orderId");
                return;
            }

            Order order = orderDAO.findById(orderId);
            if (order == null || order.getUser() == null || !currentUser.getId().equals(order.getUser().getId())) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Order not found");
                return;
            }

            Payment payment = paymentDAO.findByOrderId(orderId);
            if (payment == null) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Payment not found");
                return;
            }

            Map<String, Object> responseBody = new LinkedHashMap<>();
            responseBody.put("id", payment.getId());
            responseBody.put("orderId", orderId);
            responseBody.put("method", payment.getMethod());
            responseBody.put("amount", payment.getAmount());
            responseBody.put("paidAt", payment.getPaidAt());
            responseBody.put("paymentCode", payment.getPaymentCode());

            writeJson(resp, HttpServletResponse.SC_OK, responseBody);
        } catch (Exception e) {
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Could not check payment");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        prepareJsonResponse(resp);

        String pathInfo = req.getPathInfo();
        if ("/create".equals(pathInfo)) {
            createPayment(req, resp);
            return;
        }

        if ("/sepay-webhook".equals(pathInfo)) {
            handleSepayWebhook(req, resp);
            return;
        }

        writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
    }

    private void createPayment(
            HttpServletRequest req,
            HttpServletResponse resp
    ) throws IOException {

        try {
            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser == null) {
                writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            Long orderId = parseOrderId(req);
            if (orderId == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid orderId");
                return;
            }

            Order order = orderDAO.findById(orderId);
            if (order == null || order.getUser() == null || !currentUser.getId().equals(order.getUser().getId())) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Order not found");
                return;
            }

            Payment existingPayment = paymentDAO.findByOrderId(orderId);
            if (existingPayment != null) {
                Map<String, Object> responseBody = new LinkedHashMap<>();
                responseBody.put("paymentCode", existingPayment.getPaymentCode());
                responseBody.put("amount", existingPayment.getAmount());
                responseBody.put("qrUrl", buildSepayQrUrl(existingPayment));

                writeJson(resp, HttpServletResponse.SC_OK, responseBody);
                return;
            }

            BigDecimal amount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            Payment payment = new Payment(
                    order,
                    PaymentMethod.BANK_TRANSFER,
                    amount
            );
            payment.setPaymentCode(generatePaymentCode());

            paymentDAO.save(payment);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("paymentCode", payment.getPaymentCode());
            response.put("amount", payment.getAmount());
            response.put("qrUrl", buildSepayQrUrl(payment));

            writeJson(resp, HttpServletResponse.SC_OK, response);

        } catch (Exception e) {
            e.printStackTrace();
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Could not create payment");
        }
    }

    private void handleSepayWebhook(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String webhookToken = getEnv("SEPAY_WEBHOOK_TOKEN", null);
        String authorization = req.getHeader("Authorization");

        if (webhookToken == null || authorization == null || !authorization.equals(webhookToken)) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        try {
            Map<String, Object> body = objectMapper.readValue(req.getInputStream(), new TypeReference<>() {});
            BigDecimal transferAmount = parseBigDecimal(body.get("transferAmount"));
            String content = body.get("content") == null ? null : body.get("content").toString();
            String paymentCode = extractPaymentCode(content);

            if (transferAmount == null || paymentCode == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid webhook payload");
                return;
            }

            Payment payment = paymentDAO.findByPaymentCode(paymentCode);
            if (payment == null || payment.getPaidAt() != null || transferAmount.compareTo(payment.getAmount()) < 0) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Payment data does not match");
                return;
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

            writeJson(resp, HttpServletResponse.SC_OK, Map.of("success", true));
        } catch (Exception e) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid webhook payload");
        }
    }

    private String extractPaymentCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }

        Matcher matcher = PAYMENT_CODE_PATTERN.matcher(content);
        return matcher.find() ? matcher.group() : null;
    }

    private Long parseOrderId(HttpServletRequest req) {
        try {
            String orderId = req.getParameter("orderId");
            return orderId == null || orderId.isBlank() ? null : Long.parseLong(orderId);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(Object value) {
        try {
            return value == null ? null : new BigDecimal(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String generatePaymentCode() {
        return "PAY" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }

    private String buildSepayQrUrl(Payment payment) {
        String bankId = getEnv("BANK_ID", "BIDV");
        String bankAccount = getEnv("BANK_ACCOUNT", "0123456789");

        return "https://qr.sepay.vn/img"
                + "?bank=" + encode(bankId)
                + "&acc=" + encode(bankAccount)
                + "&amount=" + encode(payment.getAmount().toPlainString())
                + "&des=" + encode(payment.getPaymentCode());
    }

    private String getEnv(String key, String defaultValue) {
        String value = dotenv.get(key);
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private void prepareJsonResponse(HttpServletResponse resp) {
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("application/json; charset=UTF-8");
    }

    private void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        objectMapper.writeValue(resp.getWriter(), body);
    }

    private void writeError(HttpServletResponse resp, int status, String message) throws IOException {
        writeJson(resp, status, Map.of("error", message));
    }
}
