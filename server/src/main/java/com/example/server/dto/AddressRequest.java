package com.example.server.dto;

public class AddressRequest {
    private String receiverName;
    private String receiverPhone;
    private String country = "Vietnam";
    private String province;
    private String district;
    private String ward;
    private String streetDetail;
    private Boolean isDefault = false;


    public AddressRequest() {}

    public AddressRequest(String receiverName, String receiverPhone, String country, String province, String district, String ward, String streetDetail, Boolean isDefault) {
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.country = country;
        this.province = province;
        this.district = district;
        this.ward = ward;
        this.streetDetail = streetDetail;
        this.isDefault = isDefault;
    }

    // Getter and Setter
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

    public void setIsDefault(Boolean aDefault) {
        isDefault = aDefault;
    }
}
