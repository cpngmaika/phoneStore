package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.coupon.CouponRequest;
import com.example.server.service.CouponService;
import com.example.server.util.JsonUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/api/admin/coupons/*")
public class AdminCouponServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(AdminCouponServlet.class.getName());
    private final CouponService couponService = new CouponService();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path != null && !"/".equals(path)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }
        try {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success(couponService.getAllCoupons()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load admin coupons", e);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Không thể tải danh sách mã giảm giá."));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        if (!isCollectionPath(req.getPathInfo())) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }
        try {
            CouponRequest request = objectMapper.readValue(req.getReader(), CouponRequest.class);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED,
                    ApiResponse.success("Tạo mã giảm giá thành công.", couponService.createCoupon(request)));
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to create coupon", e);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("Không thể tạo mã giảm giá."));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Long id = parseId(req.getPathInfo());
        if (id == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("ID mã giảm giá không hợp lệ."));
            return;
        }
        try {
            CouponRequest request = objectMapper.readValue(req.getReader(), CouponRequest.class);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success("Cập nhật mã giảm giá thành công.", couponService.updateCoupon(id, request)));
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to update coupon", e);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("Không thể cập nhật mã giảm giá."));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Long id = parseId(req.getPathInfo());
        if (id == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("ID mã giảm giá không hợp lệ."));
            return;
        }
        try {
            couponService.deleteCoupon(id);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success("Xóa mã giảm giá thành công.", null));
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to delete coupon", e);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Không thể xóa mã giảm giá."));
        }
    }

    private boolean isCollectionPath(String path) {
        return path == null || "/".equals(path);
    }

    private Long parseId(String path) {
        if (path == null || !path.matches("/\\d+")) return null;
        try {
            return Long.parseLong(path.substring(1));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
