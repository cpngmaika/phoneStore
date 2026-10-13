package com.example.server.dao;

import com.example.server.model.ProductReview;
import java.util.List;
import java.util.Optional;

public interface ProductReviewDao extends GenericDao<ProductReview, Long> {
    Optional<ProductReview> findOptionalById(Long id);
    List<ProductReview> findByProductId(Long productId);
    boolean existsByReviewerAndProduct(Long reviewerId, Long productId);
    boolean deleteById(Long id);
}