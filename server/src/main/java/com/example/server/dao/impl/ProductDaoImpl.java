package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductDao;
import com.example.server.model.Product;
import com.example.server.model.enums.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class ProductDaoImpl extends BaseDao<Product, Long> implements ProductDao {
    private static final String PRODUCT_DETAILS_FROM =
            " FROM Product p JOIN FETCH p.brand LEFT JOIN FETCH p.images";

    public ProductDaoImpl() {
        super(Product.class);
    }

    @Override
    public List<Product> findAll() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery(
                    "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM,
                    Product.class
            ).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<Product> findOptionalById(Long id) {
        if (id == null) {
            return Optional.empty();
        }

        EntityManager em = getEntityManager();
        try {
            Product product = em.createQuery(
                            "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.id = :id",
                            Product.class
                    )
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(product);
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.sku = :sku";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("sku", sku);
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> findByCategory(Category category) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.category = :category";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("category", category);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> findByBrandId(Long brandId) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.brand.id = :brandId";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("brandId", brandId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> search(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice) {
        EntityManager em = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT DISTINCT p")
                    .append(PRODUCT_DETAILS_FROM)
                    .append(" WHERE 1=1");

            if (keyword != null && !keyword.trim().isEmpty()) {
                jpql.append(" AND (LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.sku) LIKE LOWER(:keyword))");
            }
            if (category != null) {
                jpql.append(" AND p.category = :category");
            }
            if (brandId != null) {
                jpql.append(" AND p.brand.id = :brandId");
            }
            if (minPrice != null) {
                jpql.append(" AND p.price >= :minPrice");
            }
            if (maxPrice != null) {
                jpql.append(" AND p.price <= :maxPrice");
            }

            TypedQuery<Product> query = em.createQuery(jpql.toString(), Product.class);

            if (keyword != null && !keyword.trim().isEmpty()) {
                query.setParameter("keyword", "%" + keyword.trim() + "%");
            }
            if (category != null) {
                query.setParameter("category", category);
            }
            if (brandId != null) {
                query.setParameter("brandId", brandId);
            }
            if (minPrice != null) {
                query.setParameter("minPrice", minPrice);
            }
            if (maxPrice != null) {
                query.setParameter("maxPrice", maxPrice);
            }

            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean hasReferences(Long productId) {
        EntityManager em = getEntityManager();
        try {
            return hasReference(em, "OrderItem", productId)
                    || hasReference(em, "CartItem", productId)
                    || hasReference(em, "ProductReview", productId);
        } finally {
            em.close();
        }
    }

    private boolean hasReference(EntityManager em, String entityName, Long productId) {
        Long count = em.createQuery(
                        "SELECT COUNT(e) FROM " + entityName + " e WHERE e.product.id = :productId",
                        Long.class
                )
                .setParameter("productId", productId)
                .getSingleResult();
        return count > 0;
    }
}