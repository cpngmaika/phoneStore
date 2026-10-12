package com.example.server.controller;

import com.example.server.dao.impl.OrderDAOImpl;
import com.example.server.dao.impl.PaymentDAOImpl;
import com.example.server.model.Order;
import com.example.server.model.Payment;
import com.example.server.model.enums.OrderStatus;
import com.example.server.model.enums.PaymentMethod;
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
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/api/payment/*")
public class PaymentServlet extends HttpServlet {
    private static final Pattern PAYMENT_CODE_PATTERN = Pattern.compile("PAY[A-Za-z0-9]{8}");

    private final OrderDAOImpl orderDAO = new OrderDAOImpl();
    private final PaymentDAOImpl paymentDAO = new PaymentDAOImpl();
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

            Long orderId = parseOrderId(req);
            if (orderId == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid orderId");
                return;
            }

            Payment payment = paymentDAO.findByOrderId(orderId);
            if (payment == null) {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Payment not found");
                return;
            }

            writeJson(resp, HttpServletResponse.SC_OK, payment);
        } catch (Exception e) {
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Could not check payment");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        prepareJsonResponse(resp);

        System.out.println("========== PAYMENT SERVLET ==========");
        System.out.println("URI      = " + req.getRequestURI());
        System.out.println("Context  = " + req.getContextPath());
        System.out.println("Servlet  = " + req.getServletPath());
        System.out.println("PathInfo = " + req.getPathInfo());
        System.out.println("Method   = " + req.getMethod());
        System.out.println("====================================");

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
            Long orderId = parseOrderId(req);

            if (orderId == null) {
                writeError(resp, 400, "Invalid orderId");
                return;
            }

            Order order = orderDAO.findById(orderId);

            if (order == null) {
                writeError(resp, 404, "Order not found");
                return;
            }

            Payment existingPayment = paymentDAO.findByOrderId(orderId);

            if (existingPayment != null) {
                Map<String, Object> responseBody = new LinkedHashMap<>();

                System.out.println( existingPayment);
                responseBody.put("paymentCode", existingPayment.getPaymentCode());
                responseBody.put("amount", existingPayment.getAmount());
                responseBody.put("qrUrl", buildSepayQrUrl(existingPayment));

                writeJson(resp, 200, responseBody);
                return;
            }

            Payment payment = new Payment();

            payment.setOrder(order);
            payment.setMethod(PaymentMethod.BANK_TRANSFER);
            //// SUA SAU OKE
            payment.setAmount(new BigDecimal("4000"));
            payment.setPaidAt(null);
            payment.setPaymentCode(generatePaymentCode());

            paymentDAO.save(payment);

            Map<String, Object> response = new LinkedHashMap<>();

            response.put("paymentCode", payment.getPaymentCode());
            response.put("amount", payment.getAmount());
            response.put("qrUrl", buildSepayQrUrl(payment));
            System.out.println(response);

            writeJson(resp, 200, response);

        } catch (Exception e) {
            e.printStackTrace();
            writeError(resp, 500, "Could not create payment");
        }
    }
   

    private void handleSepayWebhook(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String webhookToken = getEnv("SEPAY_WEBHOOK_TOKEN", null);
        String authorization = req.getHeader("Authorization");
        System.out.println(authorization);

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

            payment.setPaidAt(LocalDateTime.now());
            paymentDAO.update(payment);

            Order order = orderDAO.findById(payment.getOrder().getId());
            if (order == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Order not found");
                return;
            }

            order.setStatus(OrderStatus.CONFIRMED);
            orderDAO.update(order);

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
