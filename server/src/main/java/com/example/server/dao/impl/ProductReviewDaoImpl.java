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
            String jpql = "SELECT r FROM ProductReview r "
                    + "JOIN FETCH r.reviewer "
                    + "JOIN FETCH r.product "
                    + "WHERE r.product.id = :productId";
            TypedQuery<ProductReview> query = em.createQuery(jpql, ProductReview.class);
            query.setParameter("productId", productId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Object[]> countByRating(Long productId) {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery(
                            "SELECT r.rating, COUNT(r) FROM ProductReview r "
                                    + "WHERE r.product.id = :productId AND r.isHidden = false "
                                    + "GROUP BY r.rating",
                            Object[].class
                    )
                    .setParameter("productId", productId)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean existsByReviewerAndProduct(Long reviewerId, Long productId) {
        EntityManager em = getEntityManager();
        try {
            Long count = em.createQuery(
                            "SELECT COUNT(r) FROM ProductReview r "
                                    + "WHERE r.reviewer.id = :reviewerId "
                                    + "AND r.product.id = :productId",
                            Long.class
                    )
                    .setParameter("reviewerId", reviewerId)
                    .setParameter("productId", productId)
                    .getSingleResult();
            return count > 0;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean deleteById(Long id) {
        return super.deleteById(id);
    }
}