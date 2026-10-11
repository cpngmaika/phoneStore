package com.example.server.dao;

import com.example.server.model.Product;
import com.example.server.model.enums.Category;

import java.util.List;

public class ProductDao extends BaseDao<Product, Long> {

    public ProductDao() {
        super(Product.class);
    }

    public List<Product> findByCategory(Category category) {
        return List.of();
    }

    public List<Product> findByBrandId(Long brandId) {
        return List.of();
    }
}
