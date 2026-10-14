package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductDao;
import com.example.server.model.Product;
import com.example.server.model.SmartPhone;
import com.example.server.model.Tablet;
import com.example.server.model.Earphone;
import com.example.server.model.Charger;
import com.example.server.model.Cable;
import com.example.server.model.Case;
import com.example.server.model.enums.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class ProductDaoImpl extends BaseDao<Product, Long> implements ProductDao {
    private static final List<Class<? extends Product>> PRODUCT_TYPES = List.of(
            SmartPhone.class,
            Tablet.class,
            Earphone.class,
            Charger.class,
            Cable.class,
            Case.class
    );

    public ProductDaoImpl() {
        super(Product.class);
    }

    @Override
    public List<Product> findAll() {
        return search(null, null, null, null, null);
    }

    @Override
    public Optional<Product> findOptionalById(Long id) {
        if (id == null) {
            return Optional.empty();
        }

        return findFirst(PRODUCT_TYPES.stream()
                .flatMap(type -> findByType(type, id, null, null, null, null, null, null).stream())
                .toList());
    }

    @Override
    public Product findById(Long id) {
        return findOptionalById(id).orElse(null);
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        return findFirst(PRODUCT_TYPES.stream()
                .flatMap(type -> findByType(type, null, sku, null, null, null, null, null).stream())
                .toList());
    }


    @Override
    public List<Product> search(
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        List<Product> products = new ArrayList<>();
        for (Class<? extends Product> type : PRODUCT_TYPES) {
            products.addAll(findByType(
                    type, null, null, keyword, category, brandId, minPrice, maxPrice
            ));
        }
        products.sort(Comparator.comparing(Product::getId));
        return products;
    }

    @Override
    public boolean hasReferences(Long productId) {
        EntityManager em = getEntityManager();
        try {
            return hasLineItemReference(em, productId)
                    || hasReference(em, "ProductReview", productId);
        } finally {
            em.close();
        }
    }

    @Override
    public boolean deleteById(Long id) {
        if (id == null) return false;
        Optional<Product> product = findOptionalById(id);
        if (product.isEmpty()) return false;
        delete(product.get());
        return true;
    }

    private Optional<Product> findFirst(List<? extends Product> matches) {
        return matches.isEmpty() ? Optional.empty() : Optional.of(matches.get(0));
    }

    private <T extends Product> List<T> findByType(
            Class<T> type,
            Long id,
            String sku,
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder builder = em.getCriteriaBuilder();
            CriteriaQuery<T> criteria = builder.createQuery(type);
            Root<T> product = criteria.from(type);
            product.fetch("brand", JoinType.INNER);
            product.fetch("images", JoinType.LEFT);
            product.fetch("warrantyPolicy", JoinType.LEFT);

            List<Predicate> filters = new ArrayList<>();
            if (id != null) filters.add(builder.equal(product.get("id"), id));
            if (sku != null) filters.add(builder.equal(product.get("sku"), sku));
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                filters.add(builder.or(
                        builder.like(builder.lower(product.get("name")), pattern),
                        builder.like(builder.lower(product.get("sku")), pattern)
                ));
            }
            if (category != null) filters.add(builder.equal(product.get("category"), category));
            if (brandId != null) filters.add(builder.equal(product.get("brand").get("id"), brandId));
            if (minPrice != null) filters.add(builder.greaterThanOrEqualTo(product.get("price"), minPrice));
            if (maxPrice != null) filters.add(builder.lessThanOrEqualTo(product.get("price"), maxPrice));

            criteria.select(product).distinct(true).where(filters.toArray(Predicate[]::new));
            return em.createQuery(criteria).getResultList();
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

    private boolean hasLineItemReference(EntityManager em, Long productId) {
        Long count = em.createQuery(
                        "SELECT COUNT(item) FROM LineItem item "
                                + "WHERE item.product.id = :productId",
                        Long.class
                )
                .setParameter("productId", productId)
                .getSingleResult();
        return count > 0;
    }
}