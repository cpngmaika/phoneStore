package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chargers")
@PrimaryKeyJoinColumn(name = "product_id")
public class Charger extends Accessory {

    @Column(name = "wattage_w", nullable = false)
    private Integer wattageW;

    @Column(name = "number_of_ports", nullable = false)
    private Integer numberOfPorts;

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    protected Charger() {
    }

    public Charger(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            Integer wattageW,
            Integer numberOfPorts,
            String connectionType
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CHARGER,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.wattageW = wattageW;
        this.numberOfPorts = numberOfPorts;
        this.connectionType = connectionType;
    }

    public boolean isFastCharge() {
        return wattageW != null && wattageW >= 20;
    }

    @Override
    public String getSpecifications() {
        return "Power: " + wattageW + "W"
                + ", Ports: " + numberOfPorts
                + ", Connection: " + connectionType;
    }

    public Integer getWattageW() {
        return wattageW;
    }

    public void setWattageW(Integer wattageW) {
        this.wattageW = wattageW;
    }

    public Integer getNumberOfPorts() {
        return numberOfPorts;
    }

    public void setNumberOfPorts(Integer numberOfPorts) {
        this.numberOfPorts = numberOfPorts;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }
}