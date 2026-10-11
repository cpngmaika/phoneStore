package com.example.server.dao;

import com.example.server.model.ProductReview;

import java.util.List;

public class ProductReviewDao extends BaseDao<ProductReview, Long> {

    public ProductReviewDao() {
        super(ProductReview.class);
    }

    public List<ProductReview> findByProductId(Long productId) {
        return List.of();
    }
}
