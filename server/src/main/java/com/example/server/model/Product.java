package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "products",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_products_sku",
                        columnNames = "sku"
                )
        }
)
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "brand_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_products_brand")
    )
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "warranty_policy_id",
            foreignKey = @ForeignKey(name = "fk_products_warranty")
    )
    private WarrantyPolicy warrantyPolicy;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<ProductReview> reviews = new ArrayList<>();

    protected Product() {
    }

    protected Product(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Category category,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy
    ) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.status = status;
        this.brand = brand;
        this.warrantyPolicy = warrantyPolicy;
    }

    public abstract String getSpecifications();

    public Long getId() {
        return id;
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

    public List<ProductReview> getReviews() {
        return reviews;
    }
}