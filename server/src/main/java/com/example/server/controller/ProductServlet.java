package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.product.PagedProductResponse;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.model.enums.Category;
import com.example.server.model.ProductImage;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.service.ProductService;
import com.example.server.util.SessionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.math.BigDecimal;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/products/*")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 5 * 1024 * 1024,
        maxRequestSize = 45 * 1024 * 1024
)
public class ProductServlet extends HttpServlet {
    private final ProductService productService = new ProductService();
    private final ObjectMapper objectMapper;

    // Khởi tạo Servlet và đăng ký JavaTimeModule để chuyển đổi dữ liệu thời gian trong Jackson ObjectMapper.
    public ProductServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    // Xử lý yêu cầu GET để lấy danh sách sản phẩm, lọc/tìm kiếm sản phẩm hoặc xem chi tiết theo ID.
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
            } else if ("/search".equals(pathInfo)) {
                // Public, server-paginated catalogue search used by the SSR product listing.
                String keyword = req.getParameter("keyword");
                String categoryStr = req.getParameter("category");
                String brandIdStr = req.getParameter("brandId");
                String minPriceStr = req.getParameter("minPrice");
                String maxPriceStr = req.getParameter("maxPrice");
                String sort = req.getParameter("sort");

                Category category = categoryStr != null && !categoryStr.isEmpty() ? Category.valueOf(categoryStr) : null;
                Long brandId = brandIdStr != null && !brandIdStr.isEmpty() ? Long.parseLong(brandIdStr) : null;
                BigDecimal minPrice = minPriceStr != null && !minPriceStr.isEmpty() ? new BigDecimal(minPriceStr) : null;
                BigDecimal maxPrice = maxPriceStr != null && !maxPriceStr.isEmpty() ? new BigDecimal(maxPriceStr) : null;
                int page = parseIntOrDefault(req.getParameter("page"), 1);
                int size = parseIntOrDefault(req.getParameter("size"), 12);

                PagedProductResponse result = productService.searchProductsPaged(
                        keyword, category, brandId, minPrice, maxPrice, sort, page, size
                );
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(result)));
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

    // Xử lý yêu cầu POST để tạo mới sản phẩm (yêu cầu quyền Admin).
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        if (!isAdmin(req, resp)) return;
        List<String> uploadedImageUrls = new ArrayList<>();
        boolean productSaved = false;
        try {
            ProductCreateRequest request = readProductRequest(req, uploadedImageUrls);
            ProductResponse created = productService.createProduct(request);
            productSaved = true;
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Tạo sản phẩm thành công", created)));
        } catch (Exception e) {
            if (!productSaved) ProductImage.deleteManagedImages(uploadedImageUrls);
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu PUT để cập nhật thông tin sản phẩm theo ID (yêu cầu quyền Admin).
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        if (!isAdmin(req, resp)) return;
        String pathInfo = req.getPathInfo();
        List<String> uploadedImageUrls = new ArrayList<>();
        boolean productSaved = false;
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID sản phẩm cần cập nhật");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            ProductResponse previous = productService.getProductById(id);
            ProductCreateRequest request = readProductRequest(req, uploadedImageUrls);
            ProductResponse updated = productService.updateProduct(id, request);
            productSaved = true;
            List<String> removedImageUrls = previous.getImageUrls().stream()
                    .filter(imageUrl -> !updated.getImageUrls().contains(imageUrl))
                    .toList();
            ProductImage.deleteManagedImages(removedImageUrls);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Cập nhật thành công", updated)));
        } catch (Exception e) {
            if (!productSaved) ProductImage.deleteManagedImages(uploadedImageUrls);
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    // Xử lý yêu cầu DELETE để xóa sản phẩm theo ID (yêu cầu quyền Admin).
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
            ProductResponse previous = productService.getProductById(id);
            productService.deleteProduct(id);
            ProductImage.deleteManagedImages(previous.getImageUrls());
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Xoá sản phẩm thành công", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }


    private static int parseIntOrDefault(String value, int fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return fallback;
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

    private ProductCreateRequest readProductRequest(
            HttpServletRequest req,
            List<String> uploadedImageUrls
    ) throws IOException, ServletException {
        if (req.getContentType() == null || !req.getContentType().toLowerCase().startsWith("multipart/form-data")) {
            return objectMapper.readValue(req.getReader(), ProductCreateRequest.class);
        }

        ProductCreateRequest request = null;
        List<Part> imageParts = new ArrayList<>();
        for (Part part : req.getParts()) {
            if ("product".equals(part.getName())) {
                request = objectMapper.readValue(part.getInputStream(), ProductCreateRequest.class);
            } else if ("images".equals(part.getName()) && part.getSubmittedFileName() != null
                    && !part.getSubmittedFileName().isBlank()) {
                imageParts.add(part);
            }
        }
        if (request == null) {
            throw new IllegalArgumentException("Thiếu dữ liệu sản phẩm");
        }
        int existingImageCount = request.getImageUrls() == null ? 0 : request.getImageUrls().size();
        if (existingImageCount + imageParts.size() > 8) {
            throw new IllegalArgumentException("Mỗi sản phẩm được lưu tối đa 8 ảnh.");
        }
        List<String> savedUrls = ProductImage.saveImages(imageParts, req);
        uploadedImageUrls.addAll(savedUrls);
        List<String> imageUrls = new ArrayList<>();
        if (request.getImageUrls() != null) imageUrls.addAll(request.getImageUrls());
        imageUrls.addAll(savedUrls);
        request.setImageUrls(imageUrls);
        return request;
    }
}