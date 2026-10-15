package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.coupon.CouponResponse;
import com.example.server.dto.coupon.CouponValidateRequest;
import com.example.server.dto.coupon.CouponValidationResponse;
import com.example.server.service.CouponService;
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
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/api/coupons/*")
public class CouponServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(CouponServlet.class.getName());
    private final CouponService couponService = new CouponService();
    private final ObjectMapper objectMapper;

    public CouponServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        try {
            List<CouponResponse> coupons = couponService.getAvailableCoupons();
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(coupons)));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load available coupons", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(objectMapper.writeValueAsString(
                    ApiResponse.error("Không thể tải danh sách mã giảm giá.")
            ));
        }
    }

    // Kiểm tra mã giảm giá theo giá trị đơn hàng. Backend là nguồn tính toán duy nhất.
    // Endpoint: POST /api/coupons/validate
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        if (!"/validate".equals(req.getPathInfo())) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write(objectMapper.writeValueAsString(
                    ApiResponse.error("Endpoint không tồn tại.")
            ));
            return;
        }
        try {
            CouponValidateRequest body = objectMapper.readValue(req.getReader(), CouponValidateRequest.class);
            BigDecimal orderAmount = body.getOrderAmount();
            BigDecimal discount = couponService.validateAndCalculateDiscount(body.getCode(), orderAmount);
            BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);

            CouponValidationResponse result = new CouponValidationResponse(
                    body.getCode() == null ? null : body.getCode().trim().toUpperCase(),
                    orderAmount,
                    discount,
                    finalAmount
            );
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(result)));
        } catch (IllegalArgumentException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to validate coupon", e);
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(
                    ApiResponse.error("Không thể kiểm tra mã giảm giá.")
            ));
        }
    }
}
