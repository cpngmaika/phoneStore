package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.warranty.WarrantyPolicyRequest;
import com.example.server.dto.warranty.WarrantyPolicyResponse;
import com.example.server.service.WarrantyPolicyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/warranty-policies/*")
public class WarrantyPolicyServlet extends HttpServlet {
    private final WarrantyPolicyService warrantyPolicyService = new WarrantyPolicyService();
    private final ObjectMapper objectMapper;

    public WarrantyPolicyServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<WarrantyPolicyResponse> policies = warrantyPolicyService.getAllPolicies();
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(policies)));
            } else {
                Long id = Long.parseLong(pathInfo.substring(1));
                WarrantyPolicyResponse policy = warrantyPolicyService.getPolicyById(id);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(policy)));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        try {
            WarrantyPolicyRequest request = objectMapper.readValue(req.getReader(), WarrantyPolicyRequest.class);
            WarrantyPolicyResponse created = warrantyPolicyService.createPolicy(request);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Tạo chính sách bảo hành thành công", created)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID chính sách bảo hành cần cập nhật");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            WarrantyPolicyRequest request = objectMapper.readValue(req.getReader(), WarrantyPolicyRequest.class);
            WarrantyPolicyResponse updated = warrantyPolicyService.updatePolicy(id, request);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Cập nhật chính sách thành công", updated)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID chính sách bảo hành cần xoá");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            warrantyPolicyService.deletePolicy(id);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Xoá chính sách bảo hành thành công", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}