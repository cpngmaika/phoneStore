package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.model.enums.Category;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.service.ProductService;
import com.example.server.util.SessionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.math.BigDecimal;
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
                String keyword = req.getParameter("keyword");
                String categoryStr = req.getParameter("category");
                String brandIdStr = req.getParameter("brandId");
                String minPriceStr = req.getParameter("minPrice");
                String maxPriceStr = req.getParameter("maxPrice");

                if (keyword != null || categoryStr != null || brandIdStr != null || minPriceStr != null || maxPriceStr != null) {
                    Category category = categoryStr != null && !categoryStr.isEmpty() ? Category.valueOf(categoryStr) : null;
                    Long brandId = brandIdStr != null && !brandIdStr.isEmpty() ? Long.parseLong(brandIdStr) : null;
                    BigDecimal minPrice = minPriceStr != null && !minPriceStr.isEmpty() ? new BigDecimal(minPriceStr) : null;
                    BigDecimal maxPrice = maxPriceStr != null && !maxPriceStr.isEmpty() ? new BigDecimal(maxPriceStr) : null;

                    List<ProductResponse> products = productService.searchProducts(keyword, category, brandId, minPrice, maxPrice);
                    resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(products)));
                } else {
                    List<ProductResponse> products = productService.getAllProducts();
                    resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(products)));
                }
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
        if (!isAdmin(req, resp)) return;
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
        if (!isAdmin(req, resp)) return;
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
        if (!isAdmin(req, resp)) return;
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

    private boolean isAdmin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = SessionUtil.getLoggedInUser(req);
        if (user != null && user.getRole() == Role.ADMIN) {
            return true;
        }
        resp.setStatus(user == null
                ? HttpServletResponse.SC_UNAUTHORIZED
                : HttpServletResponse.SC_FORBIDDEN);
        resp.getWriter().write(objectMapper.writeValueAsString(
                ApiResponse.error(user == null ? "Please login first" : "Admin role required")
        ));
        return false;
    }
}