package com.example.server.model;

public class User {
    // Sử dụng private theo ký hiệu '-' trên UML
    private Long id;
    private String fullName;
    private String email;
    private String passwordHash;
    private String phone;
    private String avatarUrl;
    private Role role;
    private UserStatus status;

    public User() {
    }

    // Các phương thức
    public void updateProfile() {
        // TODO: Implement logic
    }

    public Boolean changePassword(String newPassword, String oldPassword) {
        // TODO: Implement logic
        return false;
    }

    public void addAddress(Address address) {
        // TODO: Xử lý lưu address vào cơ sở dữ liệu hoặc thông qua service
        // Do đã bỏ List<Address> ở model, việc thêm có thể thao tác trực tiếp với AddressRepository
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}