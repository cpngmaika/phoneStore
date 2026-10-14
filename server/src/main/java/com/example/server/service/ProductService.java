package com.example.server.service;

import com.example.server.dao.BrandDao;
import com.example.server.dao.ProductDao;
import com.example.server.dao.WarrantyPolicyDao;
import com.example.server.dao.impl.BrandDaoImpl;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dao.impl.WarrantyPolicyDaoImpl;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.exception.AppException;
import com.example.server.model.*;
import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProductService {
    private final ProductDao productDao = new ProductDaoImpl();
    private final BrandDao brandDao = new BrandDaoImpl();
    private final WarrantyPolicyDao warrantyPolicyDao = new WarrantyPolicyDaoImpl();

    // Lấy toàn bộ danh sách sản phẩm và chuyển đổi sang dạng ProductResponse DTO.
    public List<ProductResponse> getAllProducts() {
        return productDao.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    // Tìm kiếm thông tin chi tiết của một sản phẩm theo ID, ném ngoại lệ nếu không tìm thấy.
    public ProductResponse getProductById(Long id) {
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));
        return convertToResponse(product);
    }

    // Tìm kiếm và lọc danh sách sản phẩm linh hoạt theo từ khóa, danh mục, thương hiệu và khoảng giá.
    public List<ProductResponse> searchProducts(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productDao.search(keyword, category, brandId, minPrice, maxPrice).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Tạo mới một sản phẩm dựa theo danh mục (Category) tương ứng và lưu trữ hình ảnh kèm theo.
    public ProductResponse createProduct(ProductCreateRequest request) {
        require(request, "Product request is required");
        String sku = required(request.getSku() == null ? null : request.getSku().trim(), "SKU is required");
        if (productDao.findBySku(sku).isPresent()) {
            throw new AppException("Product with SKU already exists: " + sku);
        }

        Long brandId = required(request.getBrandId(), "Brand is required");
        Brand brand = brandDao.findById(brandId);
        if (brand == null) {
            throw new AppException("Brand not found with id: " + brandId);
        }

        WarrantyPolicy warrantyPolicy = null;
        if (request.getWarrantyPolicyId() != null) {
            warrantyPolicy = warrantyPolicyDao.findById(request.getWarrantyPolicyId());
            if (warrantyPolicy == null) {
                throw new AppException("Warranty policy not found with id: " + request.getWarrantyPolicyId());
            }
        }

        Category category = required(request.getCategory(), "Product category is required");
        ProductStatus status = request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK;
        Product product;

        switch (category) {
            case TABLET:
                product = new Tablet(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy, required(request.getChipset(), "Chipset is required"),
                        required(request.getStorageGb(), "Storage is required"),
                        requiredScreenSize(request.getScreenSize()),
                        required(request.getBatteryMah(), "Battery capacity is required"),
                        required(request.getOs(), "Operating system is required"),
                        required(request.getColor(), "Color is required"),
                        required(request.getHasCellular(), "Cellular support is required")
                );
                break;
            case EARPHONE:
                product = new Earphone(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy,
                        required(request.getConnectionType(), "Connection type is required"),
                        required(request.getHasANC(), "ANC support is required"),
                        required(request.getBatteryLifeHours(), "Battery life is required")
                );
                break;
            case CHARGER:
                product = new Charger(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy,
                        required(request.getWattage(), "Wattage is required"),
                        required(request.getPortType(), "Port type is required"),
                        request.getFastChargingTech()
                );
                break;
            case CABLE:
                product = new Cable(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy,
                        required(request.getLengthMeters(), "Cable length is required"),
                        required(request.getConnectorFrom(), "Source connector is required"),
                        required(request.getConnectorTo(), "Target connector is required")
                );
                break;
            case CASE:
                product = new Case(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy,
                        required(request.getMaterial(), "Material is required"),
                        required(request.getColor(), "Color is required"),
                        required(request.getCompatibleModel(), "Compatible model is required")
                );
                break;
            case SMARTPHONE:
                product = new SmartPhone(
                        sku, required(request.getName(), "Product name is required"),
                        request.getDescription(), required(request.getPrice(), "Price is required"),
                        status, brand, warrantyPolicy, required(request.getChipset(), "Chipset is required"),
                        required(request.getStorageGb(), "Storage is required"),
                        requiredScreenSize(request.getScreenSize()),
                        required(request.getScreenTech(), "Screen technology is required"),
                        required(request.getBatteryMah(), "Battery capacity is required"),
                        required(request.getMainCameraMp(), "Main camera resolution is required"),
                        required(request.getOs(), "Operating system is required"),
                        required(request.getColor(), "Color is required"),
                        required(request.getSupports5G(), "5G support is required")
                );
                break;
            default:
                throw new AppException("Unsupported product category: " + category);
        }

        if (request.getImageUrls() != null) {
            int imageOrder = 0;
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.isBlank()) {
                    product.getImages().add(new ProductImage(product, url.trim(), imageOrder == 0, imageOrder));
                    imageOrder++;
                }
            }
        }

        productDao.save(product);
        return convertToResponse(product);
    }

    // Cập nhật thông tin chung, thông số kỹ thuật riêng và danh sách hình ảnh của sản phẩm theo ID.
    public ProductResponse updateProduct(Long id, ProductCreateRequest request) {
        require(request, "Product request is required");
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));

        if (request.getCategory() != null && request.getCategory() != product.getCategory()) {
            throw new AppException("A product's category cannot be changed after creation");
        }
        if (request.getSku() != null && !request.getSku().isBlank()) {
            productDao.findBySku(request.getSku()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new AppException("Product with SKU already exists: " + request.getSku());
                }
            });
            product.setSku(request.getSku().trim());
        }
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStatus() != null) product.setStatus(request.getStatus());
        if (request.getBrandId() != null) {
            Brand brand = brandDao.findById(request.getBrandId());
            if (brand == null) throw new AppException("Brand not found with id: " + request.getBrandId());
            product.setBrand(brand);
        }
        if (request.getWarrantyPolicyId() != null) {
            WarrantyPolicy policy = warrantyPolicyDao.findById(request.getWarrantyPolicyId());
            if (policy == null) {
                throw new AppException("Warranty policy not found with id: " + request.getWarrantyPolicyId());
            }
            product.setWarrantyPolicy(policy);
        } else if (Boolean.TRUE.equals(request.getClearWarrantyPolicy())) {
            product.setWarrantyPolicy(null);
        }
        updateSpecifications(product, request);

        if (request.getImageUrls() != null) {
            product.getImages().clear();
            int imageOrder = 0;
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.isBlank()) {
                    product.getImages().add(new ProductImage(product, url.trim(), imageOrder == 0, imageOrder));
                    imageOrder++;
                }
            }
        }

        productDao.update(product);
        return convertToResponse(product);
    }

    // Xóa sản phẩm theo ID nếu không còn dữ liệu tham chiếu (như đơn hàng, giỏ hàng hoặc đánh giá).
    public void deleteProduct(Long id) {
        if (productDao.findOptionalById(id).isEmpty()) {
            throw new AppException("Product not found with id: " + id);
        }
        if (productDao.hasReferences(id)) {
            throw new AppException(
                    "Cannot delete this product because it is referenced by an order, cart, or review. "
                            + "Set its status to DISCONTINUED instead."
            );
        }

        boolean deleted = productDao.deleteById(id);
        if (!deleted) {
            throw new AppException("Product not found with id: " + id);
        }
    }

    // Chuyển đổi đối tượng Entity Product sang đối tượng ProductResponse DTO để trả về cho Client.
    private ProductResponse convertToResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setSku(product.getSku());
        res.setName(product.getName());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setCategory(product.getCategory()); // Trả về Enum Category
        res.setStatus(product.getStatus());
        res.setBrandId(product.getBrand() != null ? product.getBrand().getId() : null);
        res.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        res.setWarrantyPolicyId(product.getWarrantyPolicy() != null ? product.getWarrantyPolicy().getId() : null);

        // Trả về danh sách URL ảnh được sắp xếp theo sortOrder
        res.setImageUrls(
                product.getImages().stream()
                        .sorted((img1, img2) -> Integer.compare(img1.getSortOrder(), img2.getSortOrder()))
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList())
        );
        res.setSpecifications(toSpecifications(product));
        return res;
    }

    // Trích xuất các thông số kỹ thuật riêng biệt của từng loại sản phẩm thành một cấu trúc Map.
    private Map<String, Object> toSpecifications(Product product) {
        Map<String, Object> specifications = new LinkedHashMap<>();
        if (product instanceof SmartPhone phone) {
            specifications.put("chipset", phone.getChipset());
            specifications.put("storageGb", phone.getStorageGb());
            specifications.put("screenSize", phone.getScreenSize());
            specifications.put("screenTech", phone.getScreenTech());
            specifications.put("batteryMah", phone.getBatteryMah());
            specifications.put("mainCameraMp", phone.getMainCameraMp());
            specifications.put("os", phone.getOs());
            specifications.put("color", phone.getColor());
            specifications.put("supports5G", phone.getSupports5G());
        } else if (product instanceof Tablet tablet) {
            specifications.put("chipset", tablet.getChipset());
            specifications.put("storageGb", tablet.getStorageGb());
            specifications.put("screenSize", tablet.getScreenSize());
            specifications.put("batteryMah", tablet.getBatteryMah());
            specifications.put("os", tablet.getOs());
            specifications.put("color", tablet.getColor());
            specifications.put("hasCellular", tablet.getHasCellular());
        } else if (product instanceof Earphone earphone) {
            specifications.put("connectionType", earphone.getConnectionType());
            specifications.put("hasANC", earphone.getHasANC());
            specifications.put("batteryLifeHours", earphone.getBatteryLifeHours());
        } else if (product instanceof Charger charger) {
            specifications.put("wattage", charger.getWattage());
            specifications.put("portType", charger.getPortType());
            specifications.put("fastChargingTech", charger.getFastChargingTech());
        } else if (product instanceof Cable cable) {
            specifications.put("lengthMeters", cable.getLengthMeters());
            specifications.put("connectorFrom", cable.getConnectorFrom());
            specifications.put("connectorTo", cable.getConnectorTo());
        } else if (product instanceof Case productCase) {
            specifications.put("material", productCase.getMaterial());
            specifications.put("color", productCase.getColor());
            specifications.put("compatibleModel", productCase.getCompatibleModel());
        }
        return specifications;
    }

    // Cập nhật các trường thông số kỹ thuật tương ứng tùy theo lớp con cụ thể của sản phẩm.
    private void updateSpecifications(Product product, ProductCreateRequest request) {
        if (product instanceof SmartPhone phone) {
            if (request.getChipset() != null) phone.setChipset(request.getChipset());
            if (request.getStorageGb() != null) phone.setStorageGb(request.getStorageGb());
            if (request.getScreenSize() != null) phone.setScreenSize(requiredScreenSize(request.getScreenSize()));
            if (request.getScreenTech() != null) phone.setScreenTech(request.getScreenTech());
            if (request.getBatteryMah() != null) phone.setBatteryMah(request.getBatteryMah());
            if (request.getMainCameraMp() != null) phone.setMainCameraMp(request.getMainCameraMp());
            if (request.getOs() != null) phone.setOs(request.getOs());
            if (request.getColor() != null) phone.setColor(request.getColor());
            if (request.getSupports5G() != null) phone.setSupports5G(request.getSupports5G());
        } else if (product instanceof Tablet tablet) {
            if (request.getChipset() != null) tablet.setChipset(request.getChipset());
            if (request.getStorageGb() != null) tablet.setStorageGb(request.getStorageGb());
            if (request.getScreenSize() != null) tablet.setScreenSize(requiredScreenSize(request.getScreenSize()));
            if (request.getBatteryMah() != null) tablet.setBatteryMah(request.getBatteryMah());
            if (request.getOs() != null) tablet.setOs(request.getOs());
            if (request.getColor() != null) tablet.setColor(request.getColor());
            if (request.getHasCellular() != null) tablet.setHasCellular(request.getHasCellular());
        } else if (product instanceof Earphone earphone) {
            if (request.getConnectionType() != null) earphone.setConnectionType(request.getConnectionType());
            if (request.getHasANC() != null) earphone.setHasANC(request.getHasANC());
            if (request.getBatteryLifeHours() != null) earphone.setBatteryLifeHours(request.getBatteryLifeHours());
        } else if (product instanceof Charger charger) {
            if (request.getWattage() != null) charger.setWattage(request.getWattage());
            if (request.getPortType() != null) charger.setPortType(request.getPortType());
            if (request.getFastChargingTech() != null) charger.setFastChargingTech(request.getFastChargingTech());
        } else if (product instanceof Cable cable) {
            if (request.getLengthMeters() != null) cable.setLengthMeters(request.getLengthMeters());
            if (request.getConnectorFrom() != null) cable.setConnectorFrom(request.getConnectorFrom());
            if (request.getConnectorTo() != null) cable.setConnectorTo(request.getConnectorTo());
        } else if (product instanceof Case productCase) {
            if (request.getMaterial() != null) productCase.setMaterial(request.getMaterial());
            if (request.getColor() != null) productCase.setColor(request.getColor());
            if (request.getCompatibleModel() != null) productCase.setCompatibleModel(request.getCompatibleModel());
        }
    }

    private BigDecimal requiredScreenSize(BigDecimal screenSize) {
        BigDecimal value = required(screenSize, "Screen size is required");
        if (value.signum() <= 0
                || value.compareTo(new BigDecimal("100")) > 0
                || value.stripTrailingZeros().scale() > 2) {
            throw new AppException("Screen size must be greater than 0, at most 100 inches, and have no more than 2 decimal places");
        }
        return value;
    }

    // Kiểm tra giá trị bắt buộc dạng generic, ném AppException nếu dữ liệu null hoặc rỗng.
    private <T> T required(T value, String message) {
        if (value == null || value instanceof String text && text.isBlank()) {
            throw new AppException(message);
        }
        return value;
    }

    // Kiểm tra đối tượng bắt buộc không được null, ném AppException nếu null.
    private void require(Object value, String message) {
        if (value == null) throw new AppException(message);
    }
}