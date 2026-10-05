package com.example.server.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public abstract class Product {
    // Sử dụng protected theo ký hiệu '#' trên UML
    protected Long id;
    protected String sku;
    protected String name;
    protected String description;
    protected BigDecimal price;
    protected Category category;
    protected ProductStatus status;
    protected Brand brand;
    protected WarrantyPolicy warrantyPolicy;
    protected List<ProductImage> images;
    protected List<ProductReview> reviews;

    public Product() {
    }

    // Phương thức abstract
    public abstract Map<String, Object> getSpecifications();

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public WarrantyPolicy getWarrantyPolicy() {
        return warrantyPolicy;
    }

    public void setWarrantyPolicy(WarrantyPolicy warrantyPolicy) {
        this.warrantyPolicy = warrantyPolicy;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public List<ProductReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<ProductReview> reviews) {
        this.reviews = reviews;
    }
}
