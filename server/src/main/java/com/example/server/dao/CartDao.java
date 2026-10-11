package com.example.server.dao;

import com.example.server.model.Cart;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

public class CartDao extends BaseDao<Cart, Long> {

    public CartDao() {
        super(Cart.class);
    }

    /** Loads the cart with its items and products in one query (avoids N+1). */
    public Optional<Cart> findByUserId(Long userId, EntityManager em) {
        List<Cart> result = em.createQuery(
                        "SELECT DISTINCT c FROM Cart c "
                                + "LEFT JOIN FETCH c.items i "
                                + "LEFT JOIN FETCH i.product "
                                + "WHERE c.user.id = :userId", Cart.class)
                .setParameter("userId", userId)
                .getResultList();
        return result.stream().findFirst();
    }
}
