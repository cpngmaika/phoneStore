
package com.example.server.dao.impl;

import com.example.server.dao.GenericDAO;
import com.example.server.model.Order;

public class OrderDAOImpl extends GenericDAO<Order> {

    public OrderDAOImpl() {
        super(Order.class);
    }
}
