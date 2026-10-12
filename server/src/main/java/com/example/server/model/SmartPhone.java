package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "smartphone_details")
@PrimaryKeyJoinColumn(name = "product_id")
public class SmartPhone extends Product {

    @Column(name = "chipset", nullable = false, length = 150)
    private String chipset;

    @Column(name = "storage_gb", nullable = false)
    private Integer storageGb;

    @Column(name = "screen_size", nullable = false, precision = 4, scale = 2)
    private BigDecimal screenSize;

    @Column(name = "screen_tech", nullable = false, length = 100)
    private String screenTech;

    @Column(name = "battery_mah", nullable = false)
    private Integer batteryMah;

    @Column(name = "main_camera_mp", nullable = false)
    private Integer mainCameraMp;

    @Column(name = "os", nullable = false, length = 100)
    private String os;

    @Column(name = "color", nullable = false, length = 100)
    private String color;

    @Column(name = "supports_5g", nullable = false)
    private Boolean supports5G = false;

    protected SmartPhone() {
    }

    public SmartPhone(
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
            String screenTech,
            Integer batteryMah,
            Integer mainCameraMp,
            String os,
            String color,
            Boolean supports5G
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.SMARTPHONE,
                status,
                brand,
                warrantyPolicy
        );

        this.chipset = chipset;
        this.storageGb = storageGb;
        this.screenSize = screenSize;
        this.screenTech = screenTech;
        this.batteryMah = batteryMah;
        this.mainCameraMp = mainCameraMp;
        this.os = os;
        this.color = color;
        this.supports5G = supports5G;
    }

    @Override
    public String getSpecifications() {
        return "Chipset: " + chipset
                + ", Storage: " + storageGb + "GB"
                + ", Screen: " + screenSize + "\" " + screenTech
                + ", Battery: " + batteryMah + "mAh"
                + ", Camera: " + mainCameraMp + "MP"
                + ", OS: " + os
                + ", Color: " + color
                + ", 5G: " + supports5G;
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

    public String getScreenTech() {
        return screenTech;
    }

    public void setScreenTech(String screenTech) {
        this.screenTech = screenTech;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public Integer getMainCameraMp() {
        return mainCameraMp;
    }

    public void setMainCameraMp(Integer mainCameraMp) {
        this.mainCameraMp = mainCameraMp;
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

    public Boolean getSupports5G() {
        return supports5G;
    }

    public void setSupports5G(Boolean supports5G) {
        this.supports5G = supports5G;
    }
}