package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cases")
@PrimaryKeyJoinColumn(name = "product_id")
public class Case extends Accessory {

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    @Column(name = "supports_magsafe", nullable = false)
    private Boolean supportsMagSafe = false;

    @Column(name = "is_shockproof", nullable = false)
    private Boolean isShockproof = false;

    protected Case() {
    }

    public Case(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            String material,
            Boolean supportsMagSafe,
            Boolean isShockproof
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CASE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.material = material;
        this.supportsMagSafe = supportsMagSafe;
        this.isShockproof = isShockproof;
    }

    @Override
    public String getSpecifications() {
        return "Material: " + material
                + ", MagSafe: " + supportsMagSafe
                + ", Shockproof: " + isShockproof;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Boolean getSupportsMagSafe() {
        return supportsMagSafe;
    }

    public void setSupportsMagSafe(Boolean supportsMagSafe) {
        this.supportsMagSafe = supportsMagSafe;
    }

    public Boolean getIsShockproof() {
        return isShockproof;
    }

    public void setIsShockproof(Boolean isShockproof) {
        this.isShockproof = isShockproof;
    }
}