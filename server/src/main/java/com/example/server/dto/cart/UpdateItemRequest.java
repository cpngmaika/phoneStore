package com.example.server.dto.cart;

/** Body of PUT /api/cart/items/{id}. A quantity <= 0 removes the item. */
public class UpdateItemRequest {
    private Integer quantity;

    public UpdateItemRequest() {
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
