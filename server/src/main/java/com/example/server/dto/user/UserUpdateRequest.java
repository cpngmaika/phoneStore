package com.example.server.dto.user;

import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;

public class UserUpdateRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Role role;
    private UserStatus status;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String fullName, String phone, String avatarUrl, Role role, UserStatus status) {
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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
