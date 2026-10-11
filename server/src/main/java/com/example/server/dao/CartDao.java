package com.example.server.dao;

import com.example.server.model.Cart;

import java.util.Optional;

public class CartDao extends BaseDao<Cart, Long> {

    public CartDao() {
        super(Cart.class);
    }

    public Optional<Cart> findByUserId(Long userId) {
        return Optional.empty();
    }
}
