package com.example.server.dto.product;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private ProductStatus status;
    private Long brandId;
    private Long warrantyPolicyId;
    private Boolean clearWarrantyPolicy;
    private List<String> imageUrls;
    private String chipset;
    private Integer storageGb;
    private BigDecimal screenSize;
    private String screenTech;
    private Integer batteryMah;
    private Integer mainCameraMp;
    private String os;
    private String color;
    private Boolean supports5G;
    private Boolean hasCellular;
    private String connectionType;
    private Boolean hasANC;
    private BigDecimal batteryLifeHours;
    private BigDecimal wattage;
    private String portType;
    private String fastChargingTech;
    private BigDecimal lengthMeters;
    private String connectorFrom;
    private String connectorTo;
    private String material;
    private String compatibleModel;

    public ProductCreateRequest() {
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public Long getWarrantyPolicyId() { return warrantyPolicyId; }
    public void setWarrantyPolicyId(Long warrantyPolicyId) { this.warrantyPolicyId = warrantyPolicyId; }

    public Boolean getClearWarrantyPolicy() { return clearWarrantyPolicy; }
    public void setClearWarrantyPolicy(Boolean clearWarrantyPolicy) { this.clearWarrantyPolicy = clearWarrantyPolicy; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getChipset() { return chipset; }
    public void setChipset(String chipset) { this.chipset = chipset; }

    public Integer getStorageGb() { return storageGb; }
    public void setStorageGb(Integer storageGb) { this.storageGb = storageGb; }

    public BigDecimal getScreenSize() { return screenSize; }
    public void setScreenSize(BigDecimal screenSize) { this.screenSize = screenSize; }

    public String getScreenTech() { return screenTech; }
    public void setScreenTech(String screenTech) { this.screenTech = screenTech; }

    public Integer getBatteryMah() { return batteryMah; }
    public void setBatteryMah(Integer batteryMah) { this.batteryMah = batteryMah; }

    public Integer getMainCameraMp() { return mainCameraMp; }
    public void setMainCameraMp(Integer mainCameraMp) { this.mainCameraMp = mainCameraMp; }

    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Boolean getSupports5G() { return supports5G; }
    public void setSupports5G(Boolean supports5G) { this.supports5G = supports5G; }

    public Boolean getHasCellular() { return hasCellular; }
    public void setHasCellular(Boolean hasCellular) { this.hasCellular = hasCellular; }

    public String getConnectionType() { return connectionType; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public Boolean getHasANC() { return hasANC; }
    public void setHasANC(Boolean hasANC) { this.hasANC = hasANC; }

    public BigDecimal getBatteryLifeHours() { return batteryLifeHours; }
    public void setBatteryLifeHours(BigDecimal batteryLifeHours) { this.batteryLifeHours = batteryLifeHours; }

    public BigDecimal getWattage() { return wattage; }
    public void setWattage(BigDecimal wattage) { this.wattage = wattage; }

    public String getPortType() { return portType; }
    public void setPortType(String portType) { this.portType = portType; }

    public String getFastChargingTech() { return fastChargingTech; }
    public void setFastChargingTech(String fastChargingTech) { this.fastChargingTech = fastChargingTech; }

    public BigDecimal getLengthMeters() { return lengthMeters; }
    public void setLengthMeters(BigDecimal lengthMeters) { this.lengthMeters = lengthMeters; }

    public String getConnectorFrom() { return connectorFrom; }
    public void setConnectorFrom(String connectorFrom) { this.connectorFrom = connectorFrom; }

    public String getConnectorTo() { return connectorTo; }
    public void setConnectorTo(String connectorTo) { this.connectorTo = connectorTo; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getCompatibleModel() { return compatibleModel; }
    public void setCompatibleModel(String compatibleModel) { this.compatibleModel = compatibleModel; }
}