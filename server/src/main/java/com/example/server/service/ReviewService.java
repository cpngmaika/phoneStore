package com.example.server.service;

import com.example.server.dao.ProductDao;
import com.example.server.dao.ProductReviewDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dao.impl.ProductReviewDaoImpl;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.review.ReviewCreateRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Product;
import com.example.server.model.ProductReview;
import com.example.server.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class ReviewService {
    private final ProductReviewDao reviewDao = new ProductReviewDaoImpl();
    private final ProductDao productDao = new ProductDaoImpl();
    private final UserDao userDao = new UserDaoImpl();

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewDao.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse createReview(Long userId, ReviewCreateRequest request) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new AppException("User not found");
        }

        Product product = productDao.findOptionalById(request.getProductId())
                .orElseThrow(() -> new AppException("Product not found"));

        ProductReview review = new ProductReview(user, product, request.getRating(), request.getContent());
        reviewDao.save(review);
        return convertToResponse(review);
    }

    public void hideReview(Long reviewId) {
        ProductReview review = reviewDao.findOptionalById(reviewId)
                .orElseThrow(() -> new AppException("Review not found"));
        review.hide();
        reviewDao.update(review);
    }

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