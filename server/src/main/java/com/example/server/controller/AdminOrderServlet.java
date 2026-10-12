package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.order.OrderResponse;
import com.example.server.model.Order;
import com.example.server.model.enums.OrderStatus;
import com.example.server.service.OrderService;
import com.example.server.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/orders/*")
public class AdminOrderServlet extends HttpServlet {
    private final OrderService orderService = new OrderService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String path = req.getPathInfo();
        try {
            if (path == null || "/".equals(path)) {
                List<OrderResponse> orders = orderService.layTatCaDonHang().stream()
                        .map(OrderServlet::toResponse)
                        .toList();
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                        ApiResponse.success("Orders retrieved successfully", orders));
                return;
            }
            if (!path.matches("/\\d+")) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        ApiResponse.error("Endpoint not found"));
                return;
            }
            Order order = orderService.timDonHangTheoId(Long.parseLong(path.substring(1)));
            if (order == null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        ApiResponse.error("Order not found"));
                return;
            }
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success("Order retrieved successfully", OrderServlet.toResponse(order)));
        } catch (Exception e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Unable to retrieve orders"));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String path = req.getPathInfo();
        String statusParameter = req.getParameter("status");

        if (path == null || !path.matches("/\\d+/status")
                || statusParameter == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("Order ID and status are required"));
            return;
        }

        try {
            Long orderId = Long.parseLong(path.substring(1, path.lastIndexOf("/")));
            OrderStatus status = OrderStatus.valueOf(statusParameter);
            if (!orderService.capNhatTrangThai(orderId, status)) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        ApiResponse.error("Order not found"));
                return;
            }
            Order updatedOrder = orderService.timDonHangTheoId(orderId);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success("Order status updated successfully",
                            OrderServlet.toResponse(updatedOrder)));
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error("Invalid order status"));
        } catch (Exception e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Unable to update order status"));
        }
    }
}
