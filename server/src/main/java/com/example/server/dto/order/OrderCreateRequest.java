package com.example.server.dto.order;

import java.util.List;

public class OrderCreateRequest {
    private String couponCode;
    private List<OrderItemRequest> items;

    public OrderCreateRequest() {
    }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
