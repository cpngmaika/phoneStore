package com.example.server.dao;

import com.example.server.model.Product;
import com.example.server.model.enums.Category;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductDao extends GenericDao<Product, Long> {
    Optional<Product> findOptionalById(Long id);
    Optional<Product> findBySku(String sku);
    List<Product> search(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Paged, server-sorted search over the public catalogue. Discontinued products are excluded.
     *
     * @param sort   one of: default, relevance, newest, price_asc, price_desc, name_asc
     * @param offset zero-based row offset
     * @param limit  maximum number of rows
     */
    List<Product> searchPaged(
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int offset,
            int limit
    );

    long count(
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    boolean hasReferences(Long productId);
    boolean deleteById(Long id);
}