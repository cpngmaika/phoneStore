package com.example.server.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "sku", unique = true)
    protected String sku;

    @Column(name = "name", nullable = false)
    protected String name;

    @Column(name = "description", columnDefinition = "TEXT")
    protected String description;

    @Column(name = "price")
    protected BigDecimal price;

    @Column(name = "category")
    protected String category;

    @Column(name = "status")
    protected String status;

    @Column(name = "brand_id")
    protected Integer brandId;

    public Product() {
    }

    public Product(Long id, String sku, String name, String description, BigDecimal price, String category, String status, Integer brandId) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.status = status;
        this.brandId = brandId;
    }

    public Map<String, Object> getSpecifications() {
        // Platform skeleton method
        return null;
    }

    // Getters and Setters
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getBrandId() {
        return brandId;
    }

    public void setBrandId(Integer brandId) {
        this.brandId = brandId;
    }
}
