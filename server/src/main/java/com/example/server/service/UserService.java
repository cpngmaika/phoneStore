package com.example.server.service;

import com.example.server.dao.AddressDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.AddressDaoImpl;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.auth.ChangePasswordRequest;
import com.example.server.dto.user.AddressRequest;
import com.example.server.dto.user.UpdateProfileRequest;
import com.example.server.dto.user.UserCreateRequest;
import com.example.server.dto.user.UserResponse;
import com.example.server.dto.user.UserUpdateRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import com.example.server.util.ValidationUtil;
import org.mindrot.jbcrypt.BCrypt;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UserService {
    private final UserDao userDao;
    private final AddressDao addressDao;
    private final AddressService addressService;

    public UserService(UserDao userDao, AddressDao addressDao) {
        this.userDao = userDao;
        this.addressDao = addressDao;
        this.addressService = new AddressService(addressDao, userDao);
    }

    public UserService() {
        this.userDao = new UserDaoImpl();
        this.addressDao = new AddressDaoImpl();
        this.addressService = new AddressService(this.addressDao, this.userDao);
    }

    public User getProfile(Long userId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    public User updateProfile(Long userId, UpdateProfileRequest req) {
        User user = getProfile(userId);

        if (req.getFullName() != null) {
            ValidationUtil.validateFullName(req.getFullName());
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
            ValidationUtil.validatePhone(req.getPhone(), true);
            user.setPhone(req.getPhone().trim());
        } else if (req.getPhone() != null) {
            user.setPhone(null);
        }
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().trim().isEmpty()) {
            ValidationUtil.validateUrl(req.getAvatarUrl());
            user.setAvatarUrl(req.getAvatarUrl().trim());
        } else if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(null);
        }

        User updated = userDao.update(user);
        if (updated != null) {
            return updated;
        } else {
            throw new RuntimeException("Update failed");
        }
    }

    public boolean changePassword(Long userId, ChangePasswordRequest req) {
        User user = getProfile(userId);
        String oldPassword = req.getOldPassword();

        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Old password cannot be empty");
        }

        ValidationUtil.validatePassword(req.getNewPassword());

        if (req.getNewPassword().equals(oldPassword)) {
            throw new IllegalArgumentException("New password cannot be the same as old password");
        }

        boolean isPasswordMatch = BCrypt.checkpw(oldPassword, user.getPasswordHash());
        if (isPasswordMatch) {
            String newPassword = BCrypt.hashpw(req.getNewPassword(), BCrypt.gensalt());
            user.setPasswordHash(newPassword);
            User updated = userDao.update(user);
            if (updated != null) {
                return true;
            } else {
                throw new RuntimeException("Password change failed");
            }
        } else {
            throw new IllegalArgumentException("Old password does not match");
        }
    }

    // Address Part
    public List<Address> getAddresses(Long userId) {
        return addressService.getAddresses(userId);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        return addressService.addAddress(userId, req);
    }

    public boolean deleteAddress(Long userId, Long addressId) {
        return addressService.deleteAddress(userId, addressId);
    }

    // ==========================================
    // Admin User Management Section
    // ==========================================

    public List<UserResponse> getAllUsers(String keyword, Role role, UserStatus status) {
        List<User> users = userDao.searchUsers(keyword, role, status);
        List<UserResponse> result = new ArrayList<>();
        for (User user : users) {
            result.add(UserResponse.fromEntity(user));
        }
        return result;
    }

    public UserResponse getUserById(Long userId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return UserResponse.fromEntity(user);
    }

    public UserResponse createUserByAdmin(UserCreateRequest req) {
        ValidationUtil.validateFullName(req.getFullName());
        ValidationUtil.validateEmail(req.getEmail());
        ValidationUtil.validatePassword(req.getPassword());
        ValidationUtil.validatePhone(req.getPhone(), false);
        ValidationUtil.validateUrl(req.getAvatarUrl());

        if (userDao.existsByEmail(req.getEmail().trim())) {
            throw new IllegalArgumentException("Email already exists: " + req.getEmail());
        }

        Role role = req.getRole() != null ? req.getRole() : Role.STAFF;
        String hashedPassword = BCrypt.hashpw(req.getPassword(), BCrypt.gensalt());

        User newUser = new User(
                req.getFullName().trim(),
                req.getEmail().trim(),
                hashedPassword,
                req.getPhone() != null && !req.getPhone().trim().isEmpty() ? req.getPhone().trim() : null,
                req.getAvatarUrl() != null && !req.getAvatarUrl().trim().isEmpty() ? req.getAvatarUrl().trim() : null,
                role,
                UserStatus.ACTIVE
        );

        User saved = userDao.save(newUser);
        if (saved == null) {
            throw new RuntimeException("Failed to create user");
        }
        return UserResponse.fromEntity(saved);
    }

    public UserResponse updateUserByAdmin(Long userId, UserUpdateRequest req, Long currentAdminId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Safety check: Admin cannot lock or demote their own account
        if (userId.equals(currentAdminId)) {
            if (req.getStatus() != null && req.getStatus() == UserStatus.LOCKED) {
                throw new IllegalArgumentException("Cannot lock your own admin account");
            }
            if (req.getRole() != null && req.getRole() != Role.ADMIN) {
                throw new IllegalArgumentException("Cannot revoke your own admin privileges");
            }
        }

        if (req.getFullName() != null) {
            ValidationUtil.validateFullName(req.getFullName());
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
            ValidationUtil.validatePhone(req.getPhone(), true);
            user.setPhone(req.getPhone().trim());
        } else if (req.getPhone() != null) {
            user.setPhone(null);
        }
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().trim().isEmpty()) {
            ValidationUtil.validateUrl(req.getAvatarUrl());
            user.setAvatarUrl(req.getAvatarUrl().trim());
        } else if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(null);
        }
        if (req.getRole() != null) {
            user.setRole(req.getRole());
        }
        if (req.getStatus() != null) {
            user.setStatus(req.getStatus());
        }

        User updated = userDao.update(user);
        if (updated == null) {
            throw new RuntimeException("Failed to update user");
        }
        return UserResponse.fromEntity(updated);
    }

    public UserResponse toggleUserStatus(Long userId, UserStatus newStatus, Long currentAdminId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        if (userId.equals(currentAdminId) && newStatus == UserStatus.LOCKED) {
            throw new IllegalArgumentException("Cannot lock your own admin account");
        }

        user.setStatus(newStatus);
        User updated = userDao.update(user);
        if (updated == null) {
            throw new RuntimeException("Failed to change user status");
        }
        return UserResponse.fromEntity(updated);
    }
}
