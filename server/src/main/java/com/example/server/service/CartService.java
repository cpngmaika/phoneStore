package com.example.server.service;

import com.example.server.config.JPAConfig;
import com.example.server.dao.CartDao;
import com.example.server.dto.cart.CartDTO;
import com.example.server.dto.cart.CartItemRequest;
import com.example.server.dto.cart.LineItemDTO;
import com.example.server.dto.cart.UpdateItemRequest;
import com.example.server.model.Cart;
import com.example.server.model.LineItem;
import com.example.server.model.Product;
import com.example.server.model.User;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public class CartService {

    private static final int MAX_QUANTITY_PER_ITEM = 99;

    private final CartDao cartDao = new CartDao();

    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String message) {
            super(message);
        }
    }

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }

    public CartDTO getCart(Long userId) {
        EntityManager em = JPAConfig.getEntityManager();
        try {
            Cart cart = cartDao.findByUserId(userId, em).orElse(null);
            return toDTO(cart, userId, em);
        } finally {
            em.close();
        }
    }

    public CartDTO addItem(Long userId, CartItemRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body is required");
        }
        if (request.getProductId() == null) {
            throw new BadRequestException("Product ID is required");
        }
        int quantity = requireValidQuantity(request.getQuantity());

        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            Product product = em.find(Product.class, request.getProductId());
            if (product == null) {
                throw new NotFoundException("Product not found");
            }
            requirePurchasable(product);

            Cart cart = cartDao.findByUserId(userId, em).orElseGet(() -> createCart(userId, em));
            LineItem existing = findItemByProductId(cart, product.getId());
            if (existing == null) {
                cart.addItem(new LineItem(product, quantity, product.getPrice()));
            } else {
                int mergedQuantity = existing.getQuantity() + quantity;
                if (mergedQuantity > MAX_QUANTITY_PER_ITEM) {
                    throw new BadRequestException("Quantity must not exceed " + MAX_QUANTITY_PER_ITEM);
                }
                existing.setQuantity(mergedQuantity);
                existing.setUnitPrice(product.getPrice());
            }

            tx.commit();
            return toDTO(cart, userId, em);
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public CartDTO updateItem(Long userId, Long itemId, UpdateItemRequest request) {
        if (itemId == null) {
            throw new BadRequestException("Item ID is required");
        }
        if (request == null) {
            throw new BadRequestException("Request body is required");
        }
        int quantity = requireValidQuantity(request.getQuantity());

        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            Cart cart = cartDao.findByUserId(userId, em)
                    .orElseThrow(() -> new NotFoundException("Cart item not found"));
            LineItem item = findItemById(cart, itemId);
            if (item == null) {
                throw new NotFoundException("Cart item not found");
            }

            if (quantity > item.getQuantity()) {
                requirePurchasable(item.getProduct());
            }
            item.setQuantity(quantity);
            item.setUnitPrice(item.getProduct().getPrice());

            tx.commit();
            return toDTO(cart, userId, em);
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public CartDTO removeItem(Long userId, Long itemId) {
        if (itemId == null) {
            throw new BadRequestException("Item ID is required");
        }

        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            Cart cart = cartDao.findByUserId(userId, em)
                    .orElseThrow(() -> new NotFoundException("Cart item not found"));
            LineItem item = findItemById(cart, itemId);
            if (item == null) {
                throw new NotFoundException("Cart item not found");
            }
            cart.removeItem(item);

            tx.commit();
            return toDTO(cart, userId, em);
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public CartDTO clearCart(Long userId) {
        EntityManager em = JPAConfig.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            Optional<Cart> cart = cartDao.findByUserId(userId, em);
            cart.ifPresent(Cart::clearItems);

            tx.commit();
            return toDTO(cart.orElse(null), userId, em);
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    private int requireValidQuantity(Integer quantity) {
        if (quantity == null) {
            throw new BadRequestException("Quantity is required");
        }
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }
        if (quantity > MAX_QUANTITY_PER_ITEM) {
            throw new BadRequestException("Quantity must not exceed " + MAX_QUANTITY_PER_ITEM);
        }
        return quantity;
    }

    private void requirePurchasable(Product product) {
        if (product.getStatus() != ProductStatus.IN_STOCK) {
            throw new BadRequestException("Product is out of stock");
        }
    }

    private Cart createCart(Long userId, EntityManager em) {
        User user = em.find(User.class, userId);
        if (user == null) {
            throw new UnauthorizedException("Unauthorized");
        }
        Cart cart = new Cart(user);
        em.persist(cart);
        return cart;
    }

    private LineItem findItemById(Cart cart, Long itemId) {
        for (LineItem item : cart.getItems()) {
            if (Objects.equals(item.getId(), itemId)) {
                return item;
            }
        }
        return null;
    }

    private LineItem findItemByProductId(Cart cart, Long productId) {
        for (LineItem item : cart.getItems()) {
            if (Objects.equals(item.getProduct().getId(), productId)) {
                return item;
            }
        }
        return null;
    }

    private CartDTO toDTO(Cart cart, Long userId, EntityManager em) {
        CartDTO dto = new CartDTO();
        dto.setUserId(userId);
        if (cart == null) {
            return dto;
        }

        List<Long> productIds = new ArrayList<>();
        for (LineItem item : cart.getItems()) {
            productIds.add(item.getProduct().getId());
        }
        Map<Long, String> images = cartDao.findPrimaryImageUrls(productIds, em);

        List<LineItemDTO> itemDtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (LineItem item : cart.getItems()) {
            Product product = item.getProduct();
            BigDecimal price = product.getPrice();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

            LineItemDTO itemDto = new LineItemDTO();
            itemDto.setId(item.getId());
            itemDto.setProductId(product.getId());
            itemDto.setProductName(product.getName());
            itemDto.setProductPrice(price);
            itemDto.setProductImage(images.get(product.getId()));
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSubtotal(subtotal);
            itemDtos.add(itemDto);

            total = total.add(subtotal);
        }

        dto.setId(cart.getId());
        dto.setItems(itemDtos);
        dto.setTotalAmount(total);
        return dto;
    }
}
