package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tablet_details")
@PrimaryKeyJoinColumn(name = "product_id")
public class Tablet extends Product {

    @Column(name = "chipset", nullable = false, length = 150)
    private String chipset;

    @Column(name = "storage_gb", nullable = false)
    private Integer storageGb;

    @Column(name = "screen_size", nullable = false, precision = 4, scale = 2)
    private BigDecimal screenSize;

    @Column(name = "battery_mah", nullable = false)
    private Integer batteryMah;

    @Column(name = "os", nullable = false, length = 100)
    private String os;

    @Column(name = "color", nullable = false, length = 100)
    private String color;

    @Column(name = "has_cellular", nullable = false)
    private Boolean hasCellular = false;

    protected Tablet() {
    }

    public Tablet(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String chipset,
            Integer storageGb,
            BigDecimal screenSize,
            Integer batteryMah,
            String os,
            String color,
            Boolean hasCellular
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.TABLET,
                status,
                brand,
                warrantyPolicy
        );

        this.chipset = chipset;
        this.storageGb = storageGb;
        this.screenSize = screenSize;
        this.batteryMah = batteryMah;
        this.os = os;
        this.color = color;
        this.hasCellular = hasCellular;
    }

    @Override
    public String getSpecifications() {
        return "Chipset: " + chipset
                + ", Storage: " + storageGb + "GB"
                + ", Screen: " + screenSize + "\""
                + ", Battery: " + batteryMah + "mAh"
                + ", OS: " + os
                + ", Color: " + color
                + ", Cellular: " + hasCellular;
    }

    public String getChipset() {
        return chipset;
    }

    public void setChipset(String chipset) {
        this.chipset = chipset;
    }

    public Integer getStorageGb() {
        return storageGb;
    }

    public void setStorageGb(Integer storageGb) {
        this.storageGb = storageGb;
    }

    public BigDecimal getScreenSize() {
        return screenSize;
    }

    public void setScreenSize(BigDecimal screenSize) {
        this.screenSize = screenSize;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getHasCellular() {
        return hasCellular;
    }

    public void setHasCellular(Boolean hasCellular) {
        this.hasCellular = hasCellular;
    }
}