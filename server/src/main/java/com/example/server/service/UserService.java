package com.example.server.service;

import com.example.server.dao.AddressDao;
import com.example.server.dao.UserDao;
import com.example.server.dto.auth.ChangePasswordRequest;
import com.example.server.dto.user.AddressRequest;
import com.example.server.dto.user.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

public class UserService {
    private final UserDao userDao;
    private final AddressDao addressDao;

    public UserService(UserDao userDao, AddressDao addressDao) {
        this.userDao = userDao;
        this.addressDao = addressDao;
    }

    public UserService() {
        this.userDao = new UserDao();
        this.addressDao = new AddressDao();
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

        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setAvatarUrl(req.getAvatarUrl());

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
        return addressDao.findByUserId(userId);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        User user = getProfile(userId);

        Address address = new Address(
                user,
                req.getReceiverName(),
                req.getReceiverPhone(),
                req.getCountry(),
                req.getProvince(),
                req.getDistrict(),
                req.getWard(),
                req.getStreetDetail(),
                req.getIsDefault() != null && req.getIsDefault()
        );

        Address saved = addressDao.save(address);
        if (saved == null) {
            throw new RuntimeException("Add address failed");
        }
        return saved;
    }

    public boolean deleteAddress(Long userId, Long addressId) {
        Address address = addressDao.findById(addressId);
        if (address == null) {
            throw new IllegalArgumentException("Address not found");
        }

        // Security: Identify the User who wants to delete address
        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: Not your address");
        }

        boolean deleted = addressDao.deleteById(addressId);
        if (!deleted) {
            throw new RuntimeException("Delete address failed");
        }
        return true;
    }
}
