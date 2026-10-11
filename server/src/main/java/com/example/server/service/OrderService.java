<<<<<<< HEAD

package com.example.server.service;

import com.example.server.config.HibernateConfig;
import com.example.server.model.Coupon;
import com.example.server.model.LineItem;
import com.example.server.model.Order;
import com.example.server.model.Product;
import com.example.server.model.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.LockModeType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderService {

    /**
     * Tạo đơn hàng và lưu toàn bộ chi tiết trong một transaction.
     *
     * order:
     * - Phải có User đã được chọn.
     * - Phải có thông tin khách hàng và địa chỉ giao hàng.
     *
     * lineItems:
     * - Mỗi LineItem phải có Product với ID hợp lệ.
     * - Phải có quantity lớn hơn 0.
     *
     * couponId:
     * - Truyền null nếu không sử dụng coupon.
     *
     * shippingFee:
     * - Phí vận chuyển không được âm.
     */
    public Order taoDonHang(
            Order order,
            List<LineItem> lineItems,
            Long couponId,
            BigDecimal shippingFee) {

        if (product.getStatus() == null
                || !product.getStatus().equalsIgnoreCase("ACTIVE")) {
            throw new IllegalArgumentException(
                    "Sản phẩm hiện không thể đặt hàng");
        }

        if (order == null) {
            throw new IllegalArgumentException(
                    "Thông tin đơn hàng không được để trống");
        }

        if (order.getUser() == null
                || order.getUser().getId() == null) {
            throw new IllegalArgumentException(
                    "Đơn hàng phải có người dùng hợp lệ");
        }

        if (lineItems == null || lineItems.isEmpty()) {
            throw new IllegalArgumentException(
                    "Đơn hàng phải có ít nhất một sản phẩm");
        }

        if (shippingFee == null || shippingFee.signum() < 0) {
            throw new IllegalArgumentException(
                    "Phí vận chuyển không hợp lệ");
        }

        EntityManager em = HibernateConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();

            // 1. Lấy người dùng từ database.
            User user = em.find(User.class, order.getUser().getId());

            if (user == null) {
                throw new IllegalArgumentException(
                        "Không tìm thấy người dùng");
            }

            order.setUser(user);

            // 2. Lấy giá sản phẩm từ database và tính tiền hàng.
            List<LineItem> danhSachChiTiet = new ArrayList<>();
            BigDecimal tongTienHang = BigDecimal.ZERO;

            for (LineItem item : lineItems) {
                if (item == null
                        || item.getProduct() == null
                        || item.getProduct().getId() == null) {
                    throw new IllegalArgumentException(
                            "Thông tin sản phẩm không hợp lệ");
                }

                if (item.getQuantity() == null
                        || item.getQuantity() <= 0) {
                    throw new IllegalArgumentException(
                            "Số lượng sản phẩm phải lớn hơn 0");
                }

                Product product = em.find(
                        Product.class,
                        item.getProduct().getId());

                if (product == null) {
                    throw new IllegalArgumentException(
                            "Không tìm thấy sản phẩm");
                }

                if (product.getPrice() == null
                        || product.getPrice().signum() < 0) {
                    throw new IllegalStateException(
                            "Giá sản phẩm không hợp lệ");
                }

                // Không sử dụng đơn giá do client tự gửi lên.
                item.setProduct(product);
                item.setUnitPrice(product.getPrice());
                item.setOrder(order);

                item.tinhThanhTien();

                tongTienHang = tongTienHang.add(item.getSubtotal());
                danhSachChiTiet.add(item);
            }

            // 3. Kiểm tra coupon và tính tiền giảm.
            Coupon coupon = null;
            BigDecimal tienGiam = BigDecimal.ZERO;

            if (couponId != null) {
                coupon = em.find(
                        Coupon.class,
                        couponId,
                        LockModeType.PESSIMISTIC_WRITE);

                if (coupon == null) {
                    throw new IllegalArgumentException(
                            "Không tìm thấy coupon");
                }

                LocalDateTime thoiGian = LocalDateTime.now();

                if (!coupon.isValidAt(thoiGian)) {
                    throw new IllegalArgumentException(
                            "Coupon không còn hiệu lực");
                }

                tienGiam = coupon.tinhTienGiam(tongTienHang);

                // Tăng lượt sử dụng trong cùng transaction.
                coupon.setUsedCount(coupon.getUsedCount() + 1);
            }

            // 4. Gán dữ liệu và tính tổng thanh toán.
            order.setLineItems(danhSachChiTiet);
            order.setCoupon(coupon);
            order.setSubtotal(tongTienHang);
            order.setDiscountAmount(tienGiam);
            order.setShippingFee(shippingFee);
            order.tinhTongTien();

            // 5. Lưu đơn hàng.
            // Quan hệ cascade ALL sẽ lưu các LineItem.
            em.persist(order);

            // Đẩy các thay đổi xuống database trước khi commit.
            em.flush();

            transaction.commit();

            return order;

        } catch (RuntimeException e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }

            throw e;

        } finally {
            em.close();
        }
    }
}
=======
>>>>>>> origin/main
