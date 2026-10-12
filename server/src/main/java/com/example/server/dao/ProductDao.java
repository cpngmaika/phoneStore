```java
        package com.example.server.dao;

import com.example.server.model.Product;
import jakarta.persistence.EntityManager;

public class ProductDao extends BaseDao<Product, Long> {

    public ProductDao() {
        super(Product.class);
    }

    // Tìm sản phẩm theo ID
    public Product findProductById(Long productId) {
        if (productId == null) {
            return null;
        }

        EntityManager em = getEntityManager();

        try {
            return em.find(Product.class, productId);
        } finally {
            em.close();
        }
    }
}
```