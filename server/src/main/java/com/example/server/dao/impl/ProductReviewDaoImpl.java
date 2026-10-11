package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductReviewDao;
import com.example.server.model.ProductReview;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class ProductReviewDaoImpl extends BaseDao<ProductReview, Long> implements ProductReviewDao {

    public ProductReviewDaoImpl() {
        super(ProductReview.class);
    }

    @Override
    public Optional<ProductReview> findOptionalById(Long id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public List<ProductReview> findByProductId(Long productId) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT r FROM ProductReview r WHERE r.product.id = :productId";
            TypedQuery<ProductReview> query = em.createQuery(jpql, ProductReview.class);
            query.setParameter("productId", productId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean deleteById(Long id) {
        return super.deleteById(id);
    }
}