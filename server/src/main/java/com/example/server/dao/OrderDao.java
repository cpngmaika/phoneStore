package com.example.server.dao;

import com.example.server.model.Order;

import java.util.List;

public interface OrderDao extends GenericDao<Order, Long> {

    Order findByOrderNumber(String orderNumber);

    List<Order> findByUserId(Long userId);

    boolean updateStatus(Long orderId, String status);

    List<Order> findAllWithAmount();

    Order findByOrderCode(String orderCode);
}