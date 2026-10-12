package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "chargers")
@PrimaryKeyJoinColumn(name = "product_id")
public class Charger extends Product {

    @Column(name = "wattage", nullable = false, precision = 6, scale = 2)
    private BigDecimal wattage;

    @Column(name = "port_type", nullable = false, length = 100)
    private String portType;

    @Column(name = "fast_charging_tech", length = 100)
    private String fastChargingTech;

    protected Charger() {
        super();
    }

    public Charger(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            BigDecimal wattage,
            String portType,
            String fastChargingTech
    ) {
        super(sku, name, description, price, Category.CHARGER, status, brand, warrantyPolicy);
        this.wattage = wattage;
        this.portType = portType;
        this.fastChargingTech = fastChargingTech;
    }

    @Override
    public String getSpecifications() {
        return "Wattage: " + wattage + "W, Port: " + portType +
                (fastChargingTech != null ? ", Tech: " + fastChargingTech : "");
    }

    // Getters and Setters
    public BigDecimal getWattage() {
        return wattage;
    }

    public void setWattage(BigDecimal wattage) {
        this.wattage = wattage;
    }

    public String getPortType() {
        return portType;
    }

    public void setPortType(String portType) {
        this.portType = portType;
    }

    public String getFastChargingTech() {
        return fastChargingTech;
    }

    public void setFastChargingTech(String fastChargingTech) {
        this.fastChargingTech = fastChargingTech;
    }
}