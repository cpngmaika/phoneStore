package com.example.server.dto.product;

import com.example.server.model.enums.Category;

import java.math.BigDecimal;

public class ProductSearchRequest {
    private String keyword;
    private Category category;
    private Long brandId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    public ProductSearchRequest() {
    }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
}