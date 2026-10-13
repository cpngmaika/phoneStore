package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.payment.PaymentResponse;
import com.example.server.model.User;
import com.example.server.service.PaymentService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@WebServlet("/api/payment/*")
public class PaymentServlet extends HttpServlet {

    private final PaymentService paymentService = new PaymentService();
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        prepareJsonResponse(resp);

        try {
            String path = req.getPathInfo();
            if (path == null) {
                path = "";
            }

            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser == null) {
                writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please login first");
                return;
            }

            Long orderId = parseOrderId(req);
            if (orderId == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid orderId");
                return;
            }

            PaymentResponse paymentResponse;
            if ("/check".equals(path)) {
                paymentResponse = paymentService.getPaymentByOrderId(currentUser.getId(), orderId);
                if (paymentResponse == null) {
                    writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Payment not found for order");
                    return;
                }
            } else if ("/create".equals(path) || "/qr".equals(path) || path.isEmpty() || "/".equals(path)) {
                paymentResponse = paymentService.getOrCreatePayment(currentUser.getId(), orderId);
            } else {
                writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
                return;
            }

            writeJson(resp, HttpServletResponse.SC_OK, paymentResponse);

        } catch (SecurityException e) {
            writeError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log("Error handling GET payment request", e);
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Could not process payment request");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        prepareJsonResponse(resp);

        String pathInfo = req.getPathInfo();
        if ("/create".equals(pathInfo)) {
            handleCreatePayment(req, resp);
            return;
        }

        if ("/sepay-webhook".equals(pathInfo)) {
            handleSepayWebhook(req, resp);
            return;
        }

        writeError(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
    }

    private void handleCreatePayment(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser == null) {
                writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please login first");
                return;
            }

            Long orderId = parseOrderId(req);
            if (orderId == null) {
                writeError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid orderId");
                return;
            }

            PaymentResponse payment = paymentService.getOrCreatePayment(currentUser.getId(), orderId);
            writeJson(resp, HttpServletResponse.SC_OK, payment);

        } catch (SecurityException e) {
            writeError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log("Error creating payment", e);
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Could not create payment");
        }
    }

    private void handleSepayWebhook(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String authorization = req.getHeader("Authorization");

        try {
            Map<String, Object> body = objectMapper.readValue(req.getInputStream(), new TypeReference<>() {});
            BigDecimal transferAmount = parseBigDecimal(body.get("transferAmount"));
            String content = body.get("content") == null ? null : body.get("content").toString();

            paymentService.processSepayWebhook(authorization, content, transferAmount);

            writeJson(resp, HttpServletResponse.SC_OK, Map.of("success", true));
        } catch (SecurityException e) {
            writeError(resp, HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
        } catch (IllegalArgumentException | IllegalStateException e) {
            writeError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log("Error handling SePay webhook", e);
            writeError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing webhook");
        }
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

    private void prepareJsonResponse(HttpServletResponse resp) {
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("application/json; charset=UTF-8");
    }

    private void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        objectMapper.writeValue(resp.getWriter(), body);
    }

    private void writeError(HttpServletResponse resp, int status, String message) throws IOException {
        writeJson(resp, status, ApiResponse.error(message));
    }
}
