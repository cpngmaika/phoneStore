package com.example.server.dao;

import com.example.server.model.ProductImage;
import java.util.List;

public interface ProductImageDao extends GenericDao<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}