package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/products/*")
public class ProductServlet extends HttpServlet {
    private final ProductService productService = new ProductService();
    private final ObjectMapper objectMapper;

    public ProductServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<ProductResponse> products = productService.getAllProducts();
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(products)));
            } else {
                Long id = Long.parseLong(pathInfo.substring(1));
                ProductResponse product = productService.getProductById(id);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(product)));
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
            ProductCreateRequest request = objectMapper.readValue(req.getReader(), ProductCreateRequest.class);
            ProductResponse created = productService.createProduct(request);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Tạo sản phẩm thành công", created)));
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
                throw new IllegalArgumentException("Thiếu ID sản phẩm cần cập nhật");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            ProductCreateRequest request = objectMapper.readValue(req.getReader(), ProductCreateRequest.class);
            ProductResponse updated = productService.updateProduct(id, request);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Cập nhật thành công", updated)));
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
                throw new IllegalArgumentException("Thiếu ID sản phẩm cần xoá");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            productService.deleteProduct(id);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Xoá sản phẩm thành công", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}