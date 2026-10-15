package com.example.server.service;

import com.example.server.config.JPAConfig;
import com.example.server.model.Coupon;
import com.example.server.model.LineItem;
import com.example.server.model.Order;
import com.example.server.model.Product;
import com.example.server.model.User;
import com.example.server.model.enums.OrderStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.LockModeType;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OrderService {

    // Tạo đơn hàng mới
    public Order taoDonHang(
            Long userId,
            List<LineItem> danhSachSanPham,
            String maGiamGia
    ) {
        if (userId == null) {
            throw new IllegalArgumentException(
                    "Vui lòng đăng nhập trước khi đặt hàng."
            );
        }

        if (danhSachSanPham == null || danhSachSanPham.isEmpty()) {
            throw new IllegalArgumentException(
                    "Đơn hàng phải có ít nhất một sản phẩm."
            );
        }

        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();

            // 1. Tìm người dùng trong database
            User user = em.find(User.class, userId);

            if (user == null) {
                throw new IllegalArgumentException(
                        "Không tìm thấy người dùng."
                );
            }

            // 2. Tạo đơn hàng mới
            String maDonHang = "ORD-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();

            Order order = new Order(maDonHang, user);
            order.setStatus(OrderStatus.PENDING);
            order.setOrderDate(LocalDateTime.now());

            BigDecimal tongTienHang = BigDecimal.ZERO;

            // 3. Kiểm tra từng sản phẩm và lấy giá từ database
            for (LineItem sanPhamYeuCau : danhSachSanPham) {

                if (sanPhamYeuCau == null
                        || sanPhamYeuCau.getProduct() == null
                        || sanPhamYeuCau.getProduct().getId() == null) {
                    throw new IllegalArgumentException(
                            "Thông tin sản phẩm không hợp lệ."
                    );
                }

                Integer soLuong = sanPhamYeuCau.getQuantity();

                if (soLuong == null || soLuong <= 0) {
                    throw new IllegalArgumentException(
                            "Số lượng sản phẩm phải lớn hơn 0."
                    );
                }

                Long productId = sanPhamYeuCau.getProduct().getId();

                Product product = em.find(
                        Product.class,
                        productId
                );

                if (product == null) {
                    throw new IllegalArgumentException(
                            "Không tìm thấy sản phẩm có ID: " + productId
                    );
                }

                if (product.getPrice() == null
                        || product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException(
                            "Giá sản phẩm không hợp lệ: "
                                    + product.getName()
                    );
                }

                // Không tin giá do giao diện gửi lên.
                // Luôn sử dụng giá lấy từ database.
                BigDecimal donGia = product.getPrice();

                LineItem lineItem = new LineItem(
                        product,
                        soLuong,
                        donGia
                );

                order.addLineItem(lineItem);

                tongTienHang = tongTienHang.add(
                        lineItem.getSubtotal()
                );
            }

            tongTienHang = tongTienHang.setScale(
                    2,
                    RoundingMode.HALF_UP
            );

            // 4. Kiểm tra và áp dụng mã giảm giá nếu có
            BigDecimal tienGiam = BigDecimal.ZERO;

            if (maGiamGia != null && !maGiamGia.trim().isEmpty()) {

                TypedQuery<Coupon> query = em.createQuery(
                        "SELECT c FROM Coupon c "
                                + "WHERE LOWER(c.code) = LOWER(:code)",
                        Coupon.class
                );

                query.setParameter("code", maGiamGia.trim());
                query.setLockMode(LockModeType.PESSIMISTIC_WRITE);

                List<Coupon> coupons = query.getResultList();

                if (coupons.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Mã giảm giá không tồn tại."
                    );
                }

                Coupon coupon = coupons.get(0);

                Long usageCount = em.createQuery(
                                "SELECT COUNT(o) FROM Order o WHERE o.coupon = :coupon",
                                Long.class
                        )
                        .setParameter("coupon", coupon)
                        .getSingleResult();
                if (coupon.getUsageLimit() != null
                        && usageCount >= coupon.getUsageLimit()) {
                    throw new IllegalArgumentException(
                            "Mã giảm giá đã hết lượt sử dụng."
                    );
                }

                if (!coupon.isValid(tongTienHang)) {
                    throw new IllegalArgumentException(
                            "Mã giảm giá không hợp lệ hoặc "
                                    + "đơn hàng chưa đạt giá trị tối thiểu."
                    );
                }

                tienGiam = coupon.calculateDiscount(tongTienHang);

                order.setCoupon(coupon);
            }

            // 5. Tính tổng tiền cuối cùng
            BigDecimal tongTien = tongTienHang
                    .subtract(tienGiam)
                    .max(BigDecimal.ZERO)
                    .setScale(2, RoundingMode.HALF_UP);

            order.calculateTotal();
            order.setTotalAmount(tongTien);

            // 6. Lưu đơn hàng và các sản phẩm đi kèm
            // Quan hệ cascade ALL sẽ lưu các LineItem.
            em.persist(order);
            em.flush();

            transaction.commit();

            return order;

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw e;

        } finally {
            em.close();
        }
    }

    // Lấy danh sách đơn hàng của một người dùng
    public List<Order> layDonHangTheoNguoiDung(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }

        EntityManager em = JPAConfig.getEntityManager();

        try {
            TypedQuery<Order> query = em.createQuery(
                    "SELECT DISTINCT o FROM Order o "
                            + "LEFT JOIN FETCH o.items item "
                            + "LEFT JOIN FETCH item.product "
                            + "LEFT JOIN FETCH o.coupon "
                            + "WHERE o.user.id = :userId "
                            + "ORDER BY o.orderDate DESC",
                    Order.class
            );

            query.setParameter("userId", userId);

            return query.getResultList();

        } finally {
            em.close();
        }
    }

    // Tìm đơn hàng theo ID
    public Order timDonHangTheoId(Long orderId) {
        if (orderId == null) {
            return null;
        }

        EntityManager em = JPAConfig.getEntityManager();

        try {
            TypedQuery<Order> query = em.createQuery(
                    "SELECT DISTINCT o FROM Order o "
                            + "LEFT JOIN FETCH o.items item "
                            + "LEFT JOIN FETCH item.product "
                            + "LEFT JOIN FETCH o.coupon "
                            + "WHERE o.id = :orderId",
                    Order.class
            );

            query.setParameter("orderId", orderId);

            List<Order> orders = query.getResultList();

            return orders.isEmpty() ? null : orders.get(0);

        } finally {
            em.close();
        }
    }

    public List<Order> layTatCaDonHang() {
        EntityManager em = JPAConfig.getEntityManager();

        try {
            return em.createQuery(
                            "SELECT DISTINCT o FROM Order o "
                                    + "LEFT JOIN FETCH o.items item "
                                    + "LEFT JOIN FETCH item.product "
                                    + "LEFT JOIN FETCH o.coupon "
                                    + "ORDER BY o.orderDate DESC",
                            Order.class
                    )
                    .getResultList();
        } finally {
            em.close();
        }
    }

    // Cập nhật trạng thái đơn hàng
    public boolean capNhatTrangThai(
            Long orderId,
            OrderStatus trangThaiMoi
    ) {
        if (orderId == null || trangThaiMoi == null) {
            return false;
        }

        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();

            Order order = em.find(Order.class, orderId);

            if (order == null) {
                transaction.rollback();
                return false;
            }

            order.setStatus(trangThaiMoi);

            transaction.commit();

            return true;

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw e;

        } finally {
            em.close();
        }
    }
}