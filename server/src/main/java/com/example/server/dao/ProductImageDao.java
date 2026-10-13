package com.example.server.dao;

import com.example.server.model.ProductImage;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface ProductImageDao extends GenericDao<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    void deleteByProductId(Long productId);
    Map<Long, String> findPrimaryImageUrls(Collection<Long> productIds);
    Map<Long, List<String>> findAllImageUrls(Collection<Long> productIds);
}