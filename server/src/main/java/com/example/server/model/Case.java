package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cases")
@PrimaryKeyJoinColumn(name = "product_id")
public class Case extends Product {

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @Column(name = "compatible_model", nullable = false, length = 100)
    private String compatibleModel;

    protected Case() {
        super();
    }

    public Case(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String material,
            String color,
            String compatibleModel
    ) {
        super(sku, name, description, price, Category.CASE, status, brand, warrantyPolicy);
        this.material = material;
        this.color = color;
        this.compatibleModel = compatibleModel;
    }

    @Override
    public String getSpecifications() {
        return "Material: " + material + ", Color: " + color + ", Compatible with: " + compatibleModel;
    }

    // Getters and Setters
    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCompatibleModel() {
        return compatibleModel;
    }

    public void setCompatibleModel(String compatibleModel) {
        this.compatibleModel = compatibleModel;
    }
}