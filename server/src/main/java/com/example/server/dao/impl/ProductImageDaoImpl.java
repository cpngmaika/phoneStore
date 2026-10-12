package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductImageDao;
import com.example.server.model.ProductImage;
import jakarta.persistence.EntityManager;
import java.util.List;

public class ProductImageDaoImpl extends BaseDao<ProductImage, Long> implements ProductImageDao {

    public ProductImageDaoImpl() {
        super(ProductImage.class);
    }

    @Override
    public List<ProductImage> findByProductId(Long productId) {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery(
                            "SELECT img FROM ProductImage img WHERE img.product.id = :productId ORDER BY img.sortOrder ASC",
                            ProductImage.class
                    )
                    .setParameter("productId", productId)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public void deleteByProductId(Long productId) {
        EntityManager em = getEntityManager();
        try {
            em.getTransaction().begin();
            em.createQuery("DELETE FROM ProductImage img WHERE img.product.id = :productId")
                    .setParameter("productId", productId)
                    .executeUpdate();
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}