package com.example.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name="addresses")
public class Address {
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="receiver_name")
    private String receiverName;

    @Column(name="receiver_phone")
    private String receiverPhone;

    @Column(name="country")
    private String country;

    @Column(name="province")
    private String province;

    @Column(name="district")
    private String district;

    @Column(name="ward")
    private String ward;

    @Column(name="street_detail")
    private String streetDetail;

    @Column(name="is_default")
    private Boolean isDefault;

    public Address(){}

    public Address(Long id, String receiverName, String receiverPhone, String country, String province, String district, String ward, String streetDetail) {
        this.id = id;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.country = country;
        this.province = province;
        this.district = district;
        this.ward = ward;
        this.streetDetail = streetDetail;
        this.isDefault = false;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getReceiverName() {
        return receiverName;
    }
    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }
    public String getReceiverPhone() {
        return receiverPhone;
    }
    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getProvince() {
        return province;
    }
    public void setProvince(String province) {
        this.province = province;
    }
    public String getDistrict() {
        return district;
    }
    public void setDistrict(String district) {
        this.district = district;
    }
    public String getWard() {
        return ward;
    }
    public void setWard(String ward) {
        this.ward = ward;
    }
    public String getStreetDetail() {
        return streetDetail;
    }
    public void setStreetDetail(String streetDetail) {
        this.streetDetail = streetDetail;
    }
    public Boolean getIsDefault() {
        return isDefault;
    }
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
