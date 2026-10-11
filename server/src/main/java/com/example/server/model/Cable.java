package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cables")
@PrimaryKeyJoinColumn(name = "product_id")
public class Cable extends Accessory {

    @Column(name = "length_meters", nullable = false, precision = 6, scale = 2)
    private BigDecimal lengthMeters;

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    protected Cable() {
    }

    public Cable(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            BigDecimal lengthMeters,
            String connectionType,
            String material
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CABLE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.lengthMeters = lengthMeters;
        this.connectionType = connectionType;
        this.material = material;
    }

    @Override
    public String getSpecifications() {
        return "Length: " + lengthMeters + "m"
                + ", Connection: " + connectionType
                + ", Material: " + material;
    }

    public BigDecimal getLengthMeters() {
        return lengthMeters;
    }

    public void setLengthMeters(BigDecimal lengthMeters) {
        this.lengthMeters = lengthMeters;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }
}