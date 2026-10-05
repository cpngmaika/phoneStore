package com.example.server.dao;

import com.example.server.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductDAO {

    Optional<Product> findById(Long id);

    Optional<Product> findBySku(String sku);

    List<Product> findAll();

    List<Product> findAll(int offset, int limit);

    List<Product> findByCategory(String category);

    List<Product> findByBrandId(Integer brandId);

    List<Product> searchByName(String keyword);

    boolean save(Product product);

    boolean update(Product product);

    boolean updateStatus(Long productId, String status);

    boolean deleteById(Long id);

    int count();
}
