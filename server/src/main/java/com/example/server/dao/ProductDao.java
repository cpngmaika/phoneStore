package com.example.server.dao;

import com.example.server.model.Product;
import com.example.server.model.enums.Category;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductDao extends GenericDao<Product, Long> {
    Optional<Product> findOptionalById(Long id);
    Optional<Product> findBySku(String sku);
    List<Product> findByCategory(Category category);
    List<Product> findByBrandId(Long brandId);
    List<Product> search(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice);
    boolean hasReferences(Long productId);
    boolean deleteById(Long id);
}