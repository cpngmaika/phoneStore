package com.example.server.dto;

public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;

    public UpdateProfileRequest(String fullName, String phone, String avatarUrl) {
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
    }

    public UpdateProfileRequest() {}

    // Getter and Setter
    public String getFullName() {return fullName;}
    public void setFullName(String fullName) {this.fullName = fullName;}
    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}
    public String getAvatarUrl() {return avatarUrl;}
    public void setAvatarUrl(String avatarUrl) {this.avatarUrl = avatarUrl;}
}
