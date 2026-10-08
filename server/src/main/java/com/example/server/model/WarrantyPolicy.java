package com.example.server.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "warranty_policies")
public class WarrantyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths;

    @Column(name = "coverage", columnDefinition = "TEXT")
    private String coverage;

    @Column(name = "exclusions", columnDefinition = "TEXT")
    private String exclusions;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @OneToMany(mappedBy = "warrantyPolicy")
    private List<Product> products = new ArrayList<>();

    protected WarrantyPolicy() {
    }

    public WarrantyPolicy(
            String name,
            Integer durationMonths,
            String coverage,
            String exclusions,
            String contactInfo
    ) {
        this.name = name;
        this.durationMonths = durationMonths;
        this.coverage = coverage;
        this.exclusions = exclusions;
        this.contactInfo = contactInfo;
    }

    public boolean isCovered(LocalDate purchaseDate) {
        if (purchaseDate == null || durationMonths == null) {
            return false;
        }
        return purchaseDate.plusMonths(durationMonths).isAfter(LocalDate.now());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public String getCoverage() {
        return coverage;
    }

    public void setCoverage(String coverage) {
        this.coverage = coverage;
    }

    public String getExclusions() {
        return exclusions;
    }

    public void setExclusions(String exclusions) {
        this.exclusions = exclusions;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<Product> getProducts() {
        return products;
    }
}