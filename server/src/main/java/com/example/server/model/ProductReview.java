package com.example.server.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "product_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_review_user_product",
                        columnNames = {"reviewer_id", "product_id"}
                )
        }
)
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "reviewer_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_reviews_reviewer")
    )
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_reviews_product")
    )
    private Product product;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    protected ProductReview() {
    }

    public ProductReview(
            User reviewer,
            Product product,
            Integer rating,
            String content
    ) {
        this.reviewer = reviewer;
        this.product = product;
        this.rating = rating;
        this.content = content;
        this.isHidden = false;
    }

    public void hide() {
        this.isHidden = true;
    }

    public Long getId() {
        return id;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(Boolean isHidden) {
        this.isHidden = isHidden;
    }
}