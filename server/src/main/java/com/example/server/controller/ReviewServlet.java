package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.review.ReviewCreateRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.model.User;
import com.example.server.service.ReviewService;
import com.example.server.util.SessionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/reviews/*")
public class ReviewServlet extends HttpServlet {
    private final ReviewService reviewService = new ReviewService();
    private final ObjectMapper objectMapper;

    // Khởi tạo ReviewServlet và đăng ký JavaTimeModule để Jackson xử lý các dạng kiểu dữ liệu thời gian.
    public ReviewServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    // Xử lý yêu cầu GET để lấy danh sách đánh giá của sản phẩm dựa trên tham số productId.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo(); // Mong đợi dạng /product/{productId} hoặc query param

        try {
            // Ví dụ: /api/reviews/product?productId=1 hoặc xử lý pathInfo
            String productIdParam = req.getParameter("productId");
            if (productIdParam != null) {
                Long productId = Long.parseLong(productIdParam);
                List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(reviews)));
            } else {
                throw new IllegalArgumentException("Thiếu tham số productId để lấy danh sách đánh giá");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu POST để tạo mới một đánh giá sản phẩm từ người dùng đã đăng nhập.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        try {
            // Lấy user đang đăng nhập từ Session
            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser == null) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error("Vui lòng đăng nhập trước khi đánh giá")));
                return;
            }

            ReviewCreateRequest request = objectMapper.readValue(req.getReader(), ReviewCreateRequest.class);
            ReviewResponse created = reviewService.createReview(currentUser.getId(), request);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Đánh giá sản phẩm thành công", created)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu PUT để thực hiện ẩn một đánh giá sản phẩm theo ID (/hide/{id}).
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo(); // Dạng /hide/{id}
        try {
            if (pathInfo != null && pathInfo.contains("/hide/")) {
                Long reviewId = Long.parseLong(pathInfo.substring(pathInfo.lastIndexOf("/") + 1));
                reviewService.hideReview(reviewId);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Ẩn đánh giá thành công", null)));
            } else {
                throw new IllegalArgumentException("Endpoint không hợp lệ");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}