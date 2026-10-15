package com.example.server.service;

import com.example.server.dao.ProductDao;
import com.example.server.dao.ProductReviewDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dao.impl.ProductReviewDaoImpl;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.review.ReviewCreateRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.dto.review.ReviewSummaryResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Product;
import com.example.server.model.ProductReview;
import com.example.server.model.User;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ReviewService {
    private final ProductReviewDao reviewDao = new ProductReviewDaoImpl();
    private final ProductDao productDao = new ProductDaoImpl();
    private final UserDao userDao = new UserDaoImpl();

    // Lấy danh sách đánh giá của một sản phẩm theo ID và chuyển đổi sang danh sách ReviewResponse DTO.
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewDao.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Tổng hợp điểm đánh giá trung bình và phân bố số sao (chỉ tính các đánh giá đang hiển thị).
    public ReviewSummaryResponse getReviewSummary(Long productId) {
        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int rating = 1; rating <= 5; rating++) {
            distribution.put(rating, 0L);
        }

        long total = 0;
        long weightedSum = 0;
        for (Object[] row : reviewDao.countByRating(productId)) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            if (rating == null || count == null) continue;
            distribution.put(rating, count);
            total += count;
            weightedSum += (long) rating * count;
        }

        ReviewSummaryResponse response = new ReviewSummaryResponse();
        response.setDistribution(distribution);
        response.setTotalReviews(total);
        response.setAverageRating(
                total == 0 ? 0.0 : Math.round(((double) weightedSum / total) * 10.0) / 10.0
        );
        return response;
    }

    // Tạo mới một đánh giá sản phẩm cho người dùng, kiểm tra điều kiện tồn tại người dùng, sản phẩm và giới hạn đánh giá 1 lần.
    public ReviewResponse createReview(Long userId, ReviewCreateRequest request) {
        if (request == null || request.getProductId() == null) {
            throw new AppException("Vui lòng chọn sản phẩm để đánh giá.");
        }

        User user = userDao.findById(userId);
        if (user == null) {
            throw new AppException("User not found");
        }

        Product product = productDao.findOptionalById(request.getProductId())
                .orElseThrow(() -> new AppException("Product not found"));

        if (reviewDao.existsByReviewerAndProduct(userId, request.getProductId())) {
            throw new AppException("Bạn chỉ có thể đánh giá sản phẩm này một lần.");
        }

        ProductReview review = new ProductReview(user, product, request.getRating(), request.getContent());
        reviewDao.save(review);
        return convertToResponse(review);
    }

    // Ẩn một đánh giá sản phẩm theo ID để phục vụ công tác quản trị nội dung.
    public void hideReview(Long reviewId) {
        ProductReview review = reviewDao.findOptionalById(reviewId)
                .orElseThrow(() -> new AppException("Review not found"));
        review.hide();
        reviewDao.update(review);
    }

    // Chuyển đổi đối tượng Entity ProductReview sang đối tượng ReviewResponse DTO để trả về cho Client.
    private ReviewResponse convertToResponse(ProductReview review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setReviewerName(review.getReviewer() != null ? review.getReviewer().getFullName() : "Anonymous");
        res.setProductId(review.getProduct() != null ? review.getProduct().getId() : null);
        res.setRating(review.getRating());
        res.setContent(review.getContent());
        res.setIsHidden(review.getIsHidden());
        return res;
    }
}