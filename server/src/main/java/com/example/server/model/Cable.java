package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cables")
@PrimaryKeyJoinColumn(name = "product_id")
public class Cable extends Product {

    @Column(name = "length_meters", nullable = false, precision = 4, scale = 2)
    private BigDecimal lengthMeters;

    @Column(name = "connector_from", nullable = false, length = 50)
    private String connectorFrom;

    @Column(name = "connector_to", nullable = false, length = 50)
    private String connectorTo;

    protected Cable() {
        super();
    }

    public Cable(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            BigDecimal lengthMeters,
            String connectorFrom,
            String connectorTo
    ) {
        super(sku, name, description, price, Category.CABLE, status, brand, warrantyPolicy);
        this.lengthMeters = lengthMeters;
        this.connectorFrom = connectorFrom;
        this.connectorTo = connectorTo;
    }

    @Override
    public String getSpecifications() {
        return "Length: " + lengthMeters + "m, Connector: " + connectorFrom + " to " + connectorTo;
    }

    // Getters and Setters
    public BigDecimal getLengthMeters() {
        return lengthMeters;
    }

    public void setLengthMeters(BigDecimal lengthMeters) {
        this.lengthMeters = lengthMeters;
    }

    public String getConnectorFrom() {
        return connectorFrom;
    }

    public void setConnectorFrom(String connectorFrom) {
        this.connectorFrom = connectorFrom;
    }

    public String getConnectorTo() {
        return connectorTo;
    }

    public void setConnectorTo(String connectorTo) {
        this.connectorTo = connectorTo;
    }
}