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

    @Override
    public java.util.Map<Long, String> findPrimaryImageUrls(java.util.Collection<Long> productIds) {
        java.util.Map<Long, String> map = new java.util.HashMap<>();
        if (productIds == null || productIds.isEmpty()) {
            return map;
        }
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT img.product.id, img.imageUrl FROM ProductImage img "
                    + "WHERE img.product.id IN :productIds "
                    + "ORDER BY img.isPrimary DESC, img.sortOrder ASC, img.id ASC";
            List<Object[]> rows = em.createQuery(jpql, Object[].class)
                    .setParameter("productIds", productIds)
                    .getResultList();
            for (Object[] row : rows) {
                map.putIfAbsent((Long) row[0], (String) row[1]);
            }
            return map;
        } finally {
            em.close();
        }
    }

    @Override
    public java.util.Map<Long, List<String>> findAllImageUrls(java.util.Collection<Long> productIds) {
        java.util.Map<Long, List<String>> map = new java.util.HashMap<>();
        if (productIds == null || productIds.isEmpty()) {
            return map;
        }
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT img.product.id, img.imageUrl FROM ProductImage img "
                    + "WHERE img.product.id IN :productIds "
                    + "ORDER BY img.isPrimary DESC, img.sortOrder ASC, img.id ASC";
            List<Object[]> rows = em.createQuery(jpql, Object[].class)
                    .setParameter("productIds", productIds)
                    .getResultList();
            for (Object[] row : rows) {
                Long pId = (Long) row[0];
                String url = (String) row[1];
                map.computeIfAbsent(pId, k -> new java.util.ArrayList<>()).add(url);
            }
            return map;
        } finally {
            em.close();
        }
    }
}