package com.example.server.dto.product;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;

public class ProductCreateRequest {
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private ProductStatus status;
    private Long brandId;
    private Long warrantyPolicyId;

    public ProductCreateRequest() {
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public Long getWarrantyPolicyId() {
        return warrantyPolicyId;
    }

    public void setWarrantyPolicyId(Long warrantyPolicyId) {
        this.warrantyPolicyId = warrantyPolicyId;
    }
}
