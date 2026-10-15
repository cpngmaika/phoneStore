package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.service.AdminStatsService;
import com.example.server.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/api/admin/stats")
public class AdminStatsServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(AdminStatsServlet.class.getName());
    private final AdminStatsService adminStatsService = new AdminStatsService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        try {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK,
                    ApiResponse.success("Statistics retrieved successfully", adminStatsService.getStats()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load admin statistics", e);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Không thể tải thống kê."));
        }
    }
}
