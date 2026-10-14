package com.example.server.controller;

import com.example.server.dto.brand.BrandResponse;
import com.example.server.dto.common.ApiResponse;
import com.example.server.model.Brand;
import com.example.server.service.BrandService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/brands/*")
public class BrandServlet extends HttpServlet {
    private final BrandService brandService = new BrandService();
    private final ObjectMapper objectMapper;

    // Khởi tạo BrandServlet và đăng ký JavaTimeModule để Jackson xử lý các dạng kiểu dữ liệu thời gian.
    public BrandServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    // Xử lý yêu cầu GET để lấy toàn bộ danh sách thương hiệu hoặc lấy chi tiết thương hiệu theo ID.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<BrandResponse> brands = brandService.getAllBrands();
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(brands)));
            } else {
                Long id = Long.parseLong(pathInfo.substring(1));
                BrandResponse brand = brandService.getBrandById(id);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(brand)));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu POST để tạo mới một thương hiệu sản phẩm từ dữ liệu JSON trong request body.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        try {
            Brand requestBrand = objectMapper.readValue(req.getReader(), Brand.class);
            BrandResponse created = brandService.createBrand(requestBrand);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Tạo thương hiệu thành công", created)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu PUT để cập nhật thông tin thương hiệu theo ID truyền vào trên đường dẫn.
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID thương hiệu cần cập nhật");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            Brand requestBrand = objectMapper.readValue(req.getReader(), Brand.class);
            BrandResponse updated = brandService.updateBrand(id, requestBrand);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Cập nhật thương hiệu thành công", updated)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu DELETE để xóa một thương hiệu theo ID chỉ định trên đường dẫn.
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID thương hiệu cần xoá");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            brandService.deleteBrand(id);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Xoá thương hiệu thành công", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}