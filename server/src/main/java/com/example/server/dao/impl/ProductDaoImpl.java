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
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.AbstractQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    public List<Product> searchPaged(
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int offset,
            int limit
    ) {
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder builder = em.getCriteriaBuilder();

            // 1. Fetch only the ordered ids for the requested page.
            CriteriaQuery<Long> idQuery = builder.createQuery(Long.class);
            Root<Product> idRoot = idQuery.from(Product.class);
            idQuery.select(idRoot.get("id"))
                    .where(buildPublicFilters(builder, idQuery, idRoot, keyword, category, brandId, minPrice, maxPrice))
                    .orderBy(buildSort(builder, idRoot, sort));

            List<Long> ids = em.createQuery(idQuery)
                    .setFirstResult(Math.max(offset, 0))
                    .setMaxResults(Math.max(limit, 1))
                    .getResultList();

            if (ids.isEmpty()) {
                return List.of();
            }

            // 2. Eagerly load the page's products with their associations. Pagination is not
            //    applied here so that fetching the images collection does not force in-memory paging.
            List<Product> loaded = em.createQuery(
                            "SELECT DISTINCT p FROM Product p "
                                    + "JOIN FETCH p.brand "
                                    + "LEFT JOIN FETCH p.warrantyPolicy "
                                    + "LEFT JOIN FETCH p.images "
                                    + "WHERE p.id IN :ids",
                            Product.class
                    )
                    .setParameter("ids", ids)
                    .getResultList();

            Map<Long, Product> byId = new LinkedHashMap<>();
            for (Product product : loaded) {
                byId.put(product.getId(), product);
            }

            // 3. Restore the order determined by the id query.
            List<Product> ordered = new ArrayList<>();
            for (Long id : ids) {
                Product product = byId.get(id);
                if (product != null) {
                    ordered.add(product);
                }
            }
            return ordered;
        } finally {
            em.close();
        }
    }

    @Override
    public long count(
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        EntityManager em = getEntityManager();
        try {
            CriteriaBuilder builder = em.getCriteriaBuilder();
            CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
            Root<Product> product = countQuery.from(Product.class);
            countQuery.select(builder.count(product))
                    .where(buildPublicFilters(builder, countQuery, product, keyword, category, brandId, minPrice, maxPrice));
            return em.createQuery(countQuery).getSingleResult();
        } finally {
            em.close();
        }
    }

    private Predicate[] buildPublicFilters(
            CriteriaBuilder builder,
            AbstractQuery<?> query,
            Root<Product> product,
            String keyword,
            Category category,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        List<Predicate> filters = new ArrayList<>();
        // Discontinued products are never part of the public catalogue.
        filters.add(builder.notEqual(product.get("status"), ProductStatus.DISCONTINUED));

        // A product row is only usable when its concrete subtype row exists. Orphan rows
        // (e.g. category = SMARTPHONE but no smartphone_details row) cannot be instantiated
        // by Hibernate on a polymorphic query, which previously failed the whole catalogue.
        List<Predicate> concreteType = new ArrayList<>();
        for (Class<? extends Product> type : PRODUCT_TYPES) {
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<? extends Product> subtype = subquery.from(type);
            subquery.select(subtype.<Long>get("id"))
                    .where(builder.equal(subtype.<Long>get("id"), product.<Long>get("id")));
            concreteType.add(builder.exists(subquery));
        }
        filters.add(builder.or(concreteType.toArray(Predicate[]::new)));

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
        return filters.toArray(Predicate[]::new);
    }

    private List<Order> buildSort(CriteriaBuilder builder, Root<Product> product, String sort) {
        String normalized = sort == null ? "" : sort.trim().toLowerCase();
        return switch (normalized) {
            case "newest" -> List.of(builder.desc(product.get("id")));
            case "price_asc" -> List.of(
                    builder.asc(product.get("price")),
                    builder.asc(product.get("id"))
            );
            case "price_desc" -> List.of(
                    builder.desc(product.get("price")),
                    builder.asc(product.get("id"))
            );
            case "name_asc" -> List.of(
                    builder.asc(builder.lower(product.get("name"))),
                    builder.asc(product.get("id"))
            );
            default -> List.of(builder.asc(product.get("id")));
        };
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