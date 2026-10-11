package com.example.server.service;

import com.example.server.dao.CartDao;
import com.example.server.dto.cart.CartDTO;
import com.example.server.dto.cart.LineItemDTO;
import com.example.server.model.Cart;
import com.example.server.model.LineItem;
import com.example.server.model.Product;
import com.example.server.model.ProductImage;
import com.example.server.model.User;
import com.example.server.util.JpaUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.util.function.Function;


public class CartService {

    private final CartDao cartDao = new CartDao();

    /** Returns the user's cart, creating an empty one if it does not exist yet. */
    public CartDTO getCartByUserId(Long userId) {
        return inTransaction(em -> toDTO(findOrCreateCart(userId, em)));
    }

    /** Adds a product: increases the quantity if already in the cart, else adds a new line. */
    public CartDTO addToCart(Long userId, Long productId, Integer quantity) {
        if (productId == null) {
            throw new IllegalArgumentException("Product id is required");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        return inTransaction(em -> {
            Product product = em.find(Product.class, productId);
            if (product == null) {
                throw new IllegalArgumentException("Product not found: " + productId);
            }
            Cart cart = findOrCreateCart(userId, em);
            LineItem item = null;
            for (LineItem i : cart.getItems()) {
                if (i.getProduct().getId().equals(productId)) {
                    item = i;
                    break;
                }
            }
            if (item != null) {
                item.setQuantity(item.getQuantity() + quantity);
            } else {
                cart.addItem(new LineItem(product, quantity)); // persisted by cascade
            }
            em.flush(); // gives a new line item its id before mapping to the DTO
            return toDTO(cart);
        });
    }

    /** Sets a new quantity; a quantity <= 0 removes the line (orphanRemoval). */
    public CartDTO updateQuantity(Long userId, Long lineItemId, Integer newQuantity) {
        if (newQuantity == null) {
            throw new IllegalArgumentException("Quantity is required");
        }
        return inTransaction(em -> {
            Cart cart = findOrCreateCart(userId, em);
            LineItem item = findItem(cart, lineItemId);
            if (newQuantity <= 0) {
                cart.removeItem(item);
            } else {
                item.setQuantity(newQuantity);
            }
            em.flush();
            return toDTO(cart);
        });
    }

    /** Removes one line from the cart. */
    public CartDTO removeItem(Long userId, Long lineItemId) {
        return inTransaction(em -> {
            Cart cart = findOrCreateCart(userId, em);
            cart.removeItem(findItem(cart, lineItemId));
            em.flush();
            return toDTO(cart);
        });
    }

    /** Removes every line from the cart. */
    public void clearCart(Long userId) {
        inTransaction(em -> {
            findOrCreateCart(userId, em).getItems().clear();
            return null;
        });
    }

    private Cart findOrCreateCart(Long userId, EntityManager em) {
        return cartDao.findByUserId(userId, em).orElseGet(() -> {
            User user = em.find(User.class, userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found: " + userId);
            }
            Cart cart = new Cart(user);
            em.persist(cart);
            return cart;
        });
    }

    /** Looks only inside the user's own cart, so other users' items are unreachable. */
    private LineItem findItem(Cart cart, Long lineItemId) {
        for (LineItem item : cart.getItems()) {
            if (item.getId().equals(lineItemId)) {
                return item;
            }
        }
        throw new IllegalArgumentException("Cart item not found: " + lineItemId);
    }

    /** Must be called while the EntityManager is open (product images are lazy). */
    private CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        for (LineItem item : cart.getItems()) {
            Product p = item.getProduct();
            LineItemDTO l = new LineItemDTO();
            l.setId(item.getId());
            l.setProductId(p.getId());
            l.setProductName(p.getName());
            l.setProductPrice(p.getPrice());
            l.setProductImage(mainImage(p));
            l.setQuantity(item.getQuantity());
            l.setSubtotal(item.getSubtotal());
            dto.getItems().add(l);
        }
        dto.setTotalAmount(cart.getTotalAmount());
        return dto;
    }

    /** Primary image if present, otherwise the first image. */
    private String mainImage(Product p) {
        String first = null;
        for (ProductImage img : p.getImages()) {
            if (Boolean.TRUE.equals(img.getIsPrimary())) {
                return img.getImageUrl();
            }
            if (first == null) {
                first = img.getImageUrl();
            }
        }
        return first;
    }

    private <T> T inTransaction(Function<EntityManager, T> work) {
        EntityManager em = JpaUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T result = work.apply(em);
            tx.commit();
            return result;
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}
