package com.example.server.controller;

import com.example.server.dao.ProductDao;
import com.example.server.dao.ProductImageDao;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dao.impl.ProductImageDaoImpl;
import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.order.OrderCreateRequest;
import com.example.server.dto.order.OrderItemRequest;
import com.example.server.dto.order.OrderItemResponse;
import com.example.server.dto.order.OrderResponse;
import com.example.server.model.LineItem;
import com.example.server.model.Order;
import com.example.server.model.Product;
import com.example.server.model.User;
import com.example.server.service.OrderService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {

    private final OrderService orderService = new OrderService();
    private final ProductDao productDao = new ProductDaoImpl();
    private final ProductImageDao productImageDao = new ProductImageDaoImpl();

    @Override
    protected void doGet(
            HttpServletRequest req,
            HttpServletResponse resp
    ) throws ServletException, IOException {

        User user = SessionUtil.getLoggedInUser(req);

        if (user == null) {
            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    ApiResponse.error("Please login first")
            );
            return;
        }

        String path = req.getPathInfo();

        try {
            // GET /api/orders
            // Lấy danh sách đơn hàng của người dùng hiện tại.
            if (path == null || "/".equals(path)) {

                List<OrderResponse> orders = toResponseList(
                        orderService.layDonHangTheoNguoiDung(user.getId()),
                        productImageDao
                );

                JsonUtil.sendJson(
                        resp,
                        HttpServletResponse.SC_OK,
                        ApiResponse.success(
                                "Orders retrieved successfully",
                                orders
                        )
                );
                return;
            }

            // GET /api/orders/{id}
            Long orderId = parseOrderId(path);

            Order order = orderService.timDonHangTheoId(orderId);

            if (order == null
                    || order.getUser() == null
                    || !user.getId().equals(order.getUser().getId())) {

                JsonUtil.sendJson(
                        resp,
                        HttpServletResponse.SC_NOT_FOUND,
                        ApiResponse.error("Order not found")
                );
                return;
            }

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_OK,
                    ApiResponse.success(
                            "Order retrieved successfully",
                            toResponse(order, productImageDao)
                    )
            );

        } catch (IllegalArgumentException e) {

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error(e.getMessage())
            );

        } catch (Exception e) {

            log("Unable to retrieve orders", e);

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Unable to retrieve orders")
            );
        }
    }

    @Override
    protected void doPost(
            HttpServletRequest req,
            HttpServletResponse resp
    ) throws ServletException, IOException {

        User user = SessionUtil.getLoggedInUser(req);

        if (user == null) {
            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    ApiResponse.error("Please login first")
            );
            return;
        }

        try {
            // POST /api/orders
            OrderCreateRequest request =
                    JsonUtil.toObject(req, OrderCreateRequest.class);

            if (request == null
                    || request.getItems() == null
                    || request.getItems().isEmpty()) {

                JsonUtil.sendJson(
                        resp,
                        HttpServletResponse.SC_BAD_REQUEST,
                        ApiResponse.error(
                                "Order must contain at least one item"
                        )
                );
                return;
            }

            List<LineItem> items = new ArrayList<>();

            for (OrderItemRequest item : request.getItems()) {

                if (item == null
                        || item.getProductId() == null
                        || item.getQuantity() == null
                        || item.getQuantity() <= 0) {

                    JsonUtil.sendJson(
                            resp,
                            HttpServletResponse.SC_BAD_REQUEST,
                            ApiResponse.error("Order item is invalid")
                    );
                    return;
                }

                Optional<Product> productOptional =
                        productDao.findOptionalById(item.getProductId());

                if (productOptional.isEmpty()) {
                    JsonUtil.sendJson(
                            resp,
                            HttpServletResponse.SC_BAD_REQUEST,
                            ApiResponse.error(
                                    "Product not found: "
                                            + item.getProductId()
                            )
                    );
                    return;
                }

                Product product = productOptional.get();

                items.add(
                        new LineItem(
                                product,
                                item.getQuantity(),
                                product.getPrice()
                        )
                );
            }

            Order order = orderService.taoDonHang(
                    user.getId(),
                    items,
                    request.getCouponCode()
            );

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_CREATED,
                    ApiResponse.success(
                            "Order created successfully",
                            toResponse(order, productImageDao)
                    )
            );

        } catch (IllegalArgumentException e) {

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_BAD_REQUEST,
                    ApiResponse.error(e.getMessage())
            );

        } catch (Exception e) {

            log("Unable to create order", e);

            JsonUtil.sendJson(
                    resp,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.error("Unable to create order")
            );
        }
    }

    private static Long parseOrderId(String path) {

        if (!path.matches("/\\d+")) {
            throw new IllegalArgumentException("Invalid order ID");
        }

        try {
            return Long.parseLong(path.substring(1));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid order ID");
        }
    }

    public static OrderResponse toResponse(Order order) {
        return toResponse(order, new ProductImageDaoImpl());
    }

    public static OrderResponse toResponse(Order order, ProductImageDao productImageDao) {
        if (order == null) {
            return null;
        }
        List<OrderResponse> responses = toResponseList(List.of(order), productImageDao);
        return responses.isEmpty() ? null : responses.get(0);
    }

    public static List<OrderResponse> toResponseList(List<Order> orders, ProductImageDao productImageDao) {
        if (orders == null || orders.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .filter(item -> item.getProduct() != null && item.getProduct().getId() != null)
                .map(item -> item.getProduct().getId())
                .distinct()
                .toList();

        Map<Long, String> primaryImages = productImageDao != null
                ? productImageDao.findPrimaryImageUrls(productIds)
                : Map.of();
        Map<Long, List<String>> allImages = productImageDao != null
                ? productImageDao.findAllImageUrls(productIds)
                : Map.of();

        return orders.stream().map(order -> {
            OrderResponse response = new OrderResponse();
            response.setId(order.getId());
            response.setOrderCode(order.getOrderNumber());
            response.setStatus(order.getStatus());
            response.setTotalAmount(order.getTotalAmount());
            response.setCouponCode(
                    order.getCoupon() == null ? null : order.getCoupon().getCode()
            );

            List<OrderItemResponse> items = order.getItems().stream().map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                if (item.getProduct() != null) {
                    Long pId = item.getProduct().getId();
                    itemResponse.setProductId(pId);
                    itemResponse.setProductName(item.getProduct().getName());
                    itemResponse.setImageUrl(primaryImages.get(pId));
                    itemResponse.setImages(allImages.getOrDefault(pId, List.of()));
                }
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setUnitPrice(item.getUnitPrice());
                itemResponse.setSubtotal(item.getSubtotal());
                return itemResponse;
            }).toList();

            response.setItems(items);
            return response;
        }).toList();
    }
}