package com.example.server.dao;

import com.example.server.model.Order;

import java.util.List;
import java.util.Optional;

public class OrderDao extends BaseDao<Order, Long> {

    public OrderDao() {
        super(Order.class);
    }

    public List<Order> findByUserId(Long userId) {
        return List.of();
    }

    public Optional<Order> findByOrderCode(String orderCode) {
        return Optional.empty();
    }
}
