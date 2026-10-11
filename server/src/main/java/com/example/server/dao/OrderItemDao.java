package com.example.server.dao;

import com.example.server.model.OrderItem;
import com.example.server.model.OrderItemId;

public class OrderItemDao extends BaseDao<OrderItem, OrderItemId> {

    public OrderItemDao() {
        super(OrderItem.class);
    }
}
