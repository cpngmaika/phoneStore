package com.example.server.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/** Shopping cart: each user owns exactly one cart (one-to-one, unique user_id). */
@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_carts_user")
    )
    private User user;

    /** Removing an item from this list deletes its row (orphanRemoval). */
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineItem> items = new ArrayList<>();

    /** Required by JPA. */
    protected Cart() {
    }

    public Cart(User user) {
        this.user = user;
    }

    /** Total amount of the cart = sum of every line item subtotal. */
    public BigDecimal getTotalAmount() {
        BigDecimal total = BigDecimal.ZERO;
        for (LineItem item : items) {
            total = total.add(item.getSubtotal());
        }
        return total;
    }

    /** Keeps both sides of the relationship in sync. */
    public void addItem(LineItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(LineItem item) {
        items.remove(item);
        item.setCart(null);
    }

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<LineItem> getItems() { return items; }
}
