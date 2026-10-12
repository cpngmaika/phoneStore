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
import java.util.List;
import java.util.stream.Collectors;

public class ProductService {
    private final ProductDao productDao = new ProductDaoImpl();
    private final BrandDao brandDao = new BrandDaoImpl();
    private final WarrantyPolicyDao warrantyPolicyDao = new WarrantyPolicyDaoImpl();
    public List<ProductResponse> getAllProducts() {
        return productDao.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));
        return convertToResponse(product);
    }

    public List<ProductResponse> searchProducts(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productDao.search(keyword, category, brandId, minPrice, maxPrice).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductCreateRequest request) {
        if (request.getSku() != null && productDao.findBySku(request.getSku()).isPresent()) {
            throw new AppException("Product with SKU already exists: " + request.getSku());
        }

        Brand brand = brandDao.findById(request.getBrandId());
        if (brand == null) {
            throw new AppException("Brand not found with id: " + request.getBrandId());
        }

        WarrantyPolicy warrantyPolicy = null;
        if (request.getWarrantyPolicyId() != null) {
            warrantyPolicy = warrantyPolicyDao.findById(request.getWarrantyPolicyId());
        }

        Category category = request.getCategory() != null ? request.getCategory() : Category.SMARTPHONE;
        Product product;

        switch (category) {
            case TABLET:
                product = new Tablet(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, "Default Chipset", 128, BigDecimal.valueOf(10.1),
                        7000, "Android / iPadOS", "Silver", false
                );
                break;

            case EARPHONE:
                product = new Earphone(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, "Bluetooth", true, BigDecimal.valueOf(24)
                );
                break;

            case CHARGER:
                product = new Charger(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, BigDecimal.valueOf(20), "Type-C", "PD"
                );
                break;

            case CABLE:
                product = new Cable(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, BigDecimal.valueOf(1), "Type-C", "Type-C"
                );
                break;

            case CASE:
                product = new Case(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, "Silicone", "Black", "General"
                );
                break;

            case SMARTPHONE:
            default:
                product = new SmartPhone(
                        request.getSku(), request.getName(), request.getDescription(),
                        request.getPrice(), request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                        brand, warrantyPolicy, "Default Chipset", 128, BigDecimal.valueOf(6.1),
                        "OLED", 4000, 48, "iOS / Android", "Black", true
                );
                break;
        }
// Gán các thông tin chung cho sản phẩm
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setStatus(request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK);
        product.setBrand(brand);
        product.setWarrantyPolicy(warrantyPolicy);

        // Xử lý ánh xạ danh sách imageUrls sang ProductImage
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                boolean isPrimary = (i == 0); // Ảnh đầu tiên là ảnh chính
                ProductImage img = new ProductImage(product, url, isPrimary, i);
                product.getImages().add(img);
            }
        }

        productDao.save(product);
        return convertToResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductCreateRequest request) {
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());

        if (request.getCategory() != null) {
            product.setCategory(request.getCategory()); // Cập nhật Category enum trực tiếp
        }

        product.setStatus(request.getStatus());

        if (request.getBrandId() != null) {
            Brand brand = brandDao.findById(request.getBrandId());
            if (brand != null) product.setBrand(brand);
        }

        // Cập nhật lại danh sách hình ảnh
        if (request.getImageUrls() != null) {
            product.getImages().clear(); // orphanRemoval = true sẽ tự xóa ảnh cũ trong DB
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                boolean isPrimary = (i == 0);
                ProductImage img = new ProductImage(product, url, isPrimary, i);
                product.getImages().add(img);
            }
        }

        productDao.update(product);
        return convertToResponse(product);
    }

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
        return res;
    }
}