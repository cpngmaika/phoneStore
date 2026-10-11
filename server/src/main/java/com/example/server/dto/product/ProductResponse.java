package com.example.server.dto.product;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private ProductStatus status;
    private Long brandId;
    private String brandName;
    private Long warrantyPolicyId;
    private List<String> imageUrls;

    public ProductResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public Long getWarrantyPolicyId() { return warrantyPolicyId; }
    public void setWarrantyPolicyId(Long warrantyPolicyId) { this.warrantyPolicyId = warrantyPolicyId; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}