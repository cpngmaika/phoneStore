package com.example.server.model;

import jakarta.persistence.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Entity
@Table(name = "product_images")
public class ProductImage {
    private static final int MAX_IMAGES_PER_PRODUCT = 8;
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;
    private static final Pattern STORED_FILENAME = Pattern.compile(
            "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png|gif|webp)"
    );
    private static final String IMAGE_PATH = "/api/product-images/";
    private static final Path STORAGE_DIRECTORY = resolveStorageDirectory();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_product_images_product")
    )
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    protected ProductImage() {
    }

    public ProductImage(
            Product product,
            String imageUrl,
            Boolean isPrimary,
            Integer sortOrder
    ) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public static List<String> saveImages(Collection<Part> imageParts, HttpServletRequest request) throws IOException {
        if (imageParts.size() > MAX_IMAGES_PER_PRODUCT) {
            throw new IllegalArgumentException("Mỗi sản phẩm được tải lên tối đa 8 ảnh.");
        }

        List<String> savedUrls = new ArrayList<>();
        try {
            Files.createDirectories(STORAGE_DIRECTORY);
            for (Part part : imageParts) {
                if (part.getSize() <= 0 || part.getSize() > MAX_IMAGE_SIZE) {
                    throw new IllegalArgumentException("Mỗi ảnh phải có dung lượng từ 1 byte đến 5 MB.");
                }
                byte[] content;
                try (InputStream input = part.getInputStream()) {
                    content = input.readAllBytes();
                }
                String extension = detectImageExtension(content);
                String filename = UUID.randomUUID() + "." + extension;
                Files.write(
                        STORAGE_DIRECTORY.resolve(filename),
                        content,
                        StandardOpenOption.CREATE_NEW,
                        StandardOpenOption.WRITE
                );
                savedUrls.add(request.getContextPath() + IMAGE_PATH + filename);
            }
            return savedUrls;
        } catch (IOException | RuntimeException exception) {
            deleteManagedImages(savedUrls);
            throw exception;
        }
    }

    public static void deleteManagedImages(Collection<String> imageUrls) {
        for (String imageUrl : imageUrls) {
            String filename = getManagedFilename(imageUrl);
            if (filename == null) continue;
            try {
                Files.deleteIfExists(STORAGE_DIRECTORY.resolve(filename));
            } catch (IOException exception) {
                throw new IllegalStateException("Không thể xóa tệp ảnh sản phẩm: " + filename, exception);
            }
        }
    }

    public static Path findStoredImage(String filename) {
        if (filename == null || !STORED_FILENAME.matcher(filename).matches()) {
            return null;
        }
        Path image = STORAGE_DIRECTORY.resolve(filename).normalize();
        return image.startsWith(STORAGE_DIRECTORY) && Files.isRegularFile(image) ? image : null;
    }

    public static String getStoredImageContentType(String filename) {
        return switch (filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT)) {
            case "jpg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }

    private static Path resolveStorageDirectory() {
        String configuredDirectory = System.getenv("PHONE_STORE_UPLOAD_DIR");
        String directory = configuredDirectory == null || configuredDirectory.isBlank()
                ? Path.of(System.getProperty("user.home"), "phone-store-uploads").toString()
                : configuredDirectory;
        return Path.of(directory).toAbsolutePath().normalize();
    }

    private static String getManagedFilename(String imageUrl) {
        if (imageUrl == null) return null;
        int pathIndex = imageUrl.indexOf(IMAGE_PATH);
        if (pathIndex < 0) return null;
        String filename = imageUrl.substring(pathIndex + IMAGE_PATH.length());
        return STORED_FILENAME.matcher(filename).matches() ? filename : null;
    }

    private static String detectImageExtension(byte[] content) {
        if (content.length >= 3
                // JPEG: Bắt đầu bằng 0xFF 0xD8 0xFF
                && (content[0] & 0xff) == 0xff
                && (content[1] & 0xff) == 0xd8
                && (content[2] & 0xff) == 0xff) {
            return "jpg";
        }
        // PNG: Bắt đầu bằng 0x89 'P' 'N' 'G' '\r' '\n' 0x1A '\n'
        if (content.length >= 8
                && content[0] == (byte) 0x89
                && content[1] == 0x50
                && content[2] == 0x4e
                && content[3] == 0x47
                && content[4] == 0x0d
                && content[5] == 0x0a
                && content[6] == 0x1a
                && content[7] == 0x0a) {
            return "png";
        }
        if (content.length >= 6
                && content[0] == 'G'
                && content[1] == 'I'
                && content[2] == 'F'
                && content[3] == '8'
                && (content[4] == '7' || content[4] == '9')
                && content[5] == 'a') {
            return "gif";
        }
        if (content.length >= 12
                && content[0] == 'R'
                && content[1] == 'I'
                && content[2] == 'F'
                && content[3] == 'F'
                && content[8] == 'W'
                && content[9] == 'E'
                && content[10] == 'B'
                && content[11] == 'P') {
            return "webp";
        }
        throw new IllegalArgumentException("Chỉ chấp nhận ảnh JPEG, PNG, GIF hoặc WebP.");
    }
}