package com.example.server.dto.user;

import com.fasterxml.jackson.annotation.JsonAlias;

public class AddressRequest {
    @JsonAlias({"recipientName", "receiverName"})
    private String receiverName;

    @JsonAlias({"phone", "receiverPhone"})
    private String receiverPhone;

    private String country = "Vietnam";
    private String province;
    private String district;
    private String ward;

    @JsonAlias({"streetAddress", "streetDetail"})
    private String streetDetail;

    private Boolean isDefault;

    public AddressRequest() {
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
}
