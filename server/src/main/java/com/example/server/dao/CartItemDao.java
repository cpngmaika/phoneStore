package com.example.server.dao;

import com.example.server.model.CartItem;
import com.example.server.model.CartItemId;

public class CartItemDao extends BaseDao<CartItem, CartItemId> {

    public CartItemDao() {
        super(CartItem.class);
    }
}
