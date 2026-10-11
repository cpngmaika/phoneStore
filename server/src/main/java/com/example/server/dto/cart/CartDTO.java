package com.example.server.dto.cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private Long id;
    private Long userId;
    private List<LineItemDTO> items = new ArrayList<>();
    private BigDecimal totalAmount = BigDecimal.ZERO;

    public CartDTO() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<LineItemDTO> getItems() { return items; }
    public void setItems(List<LineItemDTO> items) { this.items = items; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
