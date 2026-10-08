package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "earphones")
@PrimaryKeyJoinColumn(name = "product_id")
public class Earphone extends Accessory {

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    @Column(name = "has_anc", nullable = false)
    private Boolean hasANC = false;

    @Column(name = "battery_life_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal batteryLifeHours;

    protected Earphone() {
    }

    public Earphone(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            String connectionType,
            Boolean hasANC,
            BigDecimal batteryLifeHours
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.EARPHONE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.connectionType = connectionType;
        this.hasANC = hasANC;
        this.batteryLifeHours = batteryLifeHours;
    }

    public boolean isWireless() {
        return connectionType != null
                && !connectionType.equalsIgnoreCase("WIRED");
    }

    @Override
    public String getSpecifications() {
        return "Connection: " + connectionType
                + ", ANC: " + hasANC
                + ", Battery: " + batteryLifeHours + " hours";
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public Boolean getHasANC() {
        return hasANC;
    }

    public void setHasANC(Boolean hasANC) {
        this.hasANC = hasANC;
    }

    public BigDecimal getBatteryLifeHours() {
        return batteryLifeHours;
    }

    public void setBatteryLifeHours(BigDecimal batteryLifeHours) {
        this.batteryLifeHours = batteryLifeHours;
    }
}