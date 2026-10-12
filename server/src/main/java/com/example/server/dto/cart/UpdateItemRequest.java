package com.example.server.dto.cart;

public class UpdateItemRequest {
    private Integer quantity;

    public UpdateItemRequest() {
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
