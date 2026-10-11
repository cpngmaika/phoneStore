package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "accessories")
@Inheritance(strategy = InheritanceType.JOINED)
@PrimaryKeyJoinColumn(name = "product_id")
public abstract class Accessory extends Product {

    @Column(name = "compatible_with", length = 255)
    private String compatibleWith;

    @Column(name = "color", length = 100)
    private String color;

    protected Accessory() {
    }

    protected Accessory(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Category category,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color
    ) {
        super(
                sku,
                name,
                description,
                price,
                category,
                status,
                brand,
                warrantyPolicy
        );

        this.compatibleWith = compatibleWith;
        this.color = color;
    }

    public String getCompatibleWith() {
        return compatibleWith;
    }

    public void setCompatibleWith(String compatibleWith) {
        this.compatibleWith = compatibleWith;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}