package com.example.server.dto.review;

import java.util.Map;

/**
 * Aggregate rating information for a product (visible reviews only).
 */
public class ReviewSummaryResponse {
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> distribution;

    public ReviewSummaryResponse() {
    }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public Map<Integer, Long> getDistribution() { return distribution; }
    public void setDistribution(Map<Integer, Long> distribution) { this.distribution = distribution; }
}
