package com.example.server.dao;

import com.example.server.model.Cart;
import jakarta.persistence.EntityManager;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class CartDao extends BaseDao<Cart, Long> {

    public CartDao() {
        super(Cart.class);
    }

        public Optional<Cart> findByUserId(Long userId) {
        EntityManager em = getEntityManager();
        try {
            return findByUserId(userId, em);
        } finally {
            em.close();
        }
    }

        public Optional<Cart> findByUserId(Long userId, EntityManager em) {
        if (userId == null) {
            return Optional.empty();
        }
        String jpql = "SELECT c FROM Cart c "
                + "LEFT JOIN FETCH c.items i "
                + "LEFT JOIN FETCH i.product "
                + "WHERE c.user.id = :userId "
                + "ORDER BY i.id ASC";
        List<Cart> carts = em.createQuery(jpql, Cart.class)
                .setParameter("userId", userId)
                .getResultList();
        return carts.stream().findFirst();
    }

      public Map<Long, String> findPrimaryImageUrls(Collection<Long> productIds, EntityManager em) {
        Map<Long, String> imageUrls = new HashMap<>();
        if (productIds == null || productIds.isEmpty()) {
            return imageUrls;
        }
        String jpql = "SELECT img.product.id, img.imageUrl FROM ProductImage img "
                + "WHERE img.product.id IN :productIds "
                + "ORDER BY img.isPrimary DESC, img.sortOrder ASC, img.id ASC";
        List<Object[]> rows = em.createQuery(jpql, Object[].class)
                .setParameter("productIds", productIds)
                .getResultList();
        for (Object[] row : rows) {
            imageUrls.putIfAbsent((Long) row[0], (String) row[1]);
        }
        return imageUrls;
    }
}
