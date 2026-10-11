package com.example.server.service;

import com.example.server.dao.AddressDAO;
import com.example.server.dao.UserDAO;
import com.example.server.dao.impl.AddressDAOImpl;
import com.example.server.dao.impl.UserDAOImpl;
import com.example.server.dto.AddressRequest;
import com.example.server.dto.ChangePasswordRequest;
import com.example.server.dto.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

public class UserService {
    private final UserDAO userDAO;
    private final AddressDAO addressDAO;

    public UserService(UserDAO userDAO, AddressDAO addressDAO)
    {
        this.userDAO = userDAO;
        this.addressDAO = addressDAO;
    }

    public UserService()
    {
        this.userDAO = new UserDAOImpl();
        this.addressDAO = new AddressDAOImpl();
    }

    public User getProfile(Long userId){
        Optional<User> userOpt = userDAO.findById(userId);

        if(userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return userOpt.get();
    }

    public User updateProfile(Long userId, UpdateProfileRequest req){
        User user = getProfile(userId);

        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setAvatarUrl(req.getAvatarUrl());

        boolean updated = userDAO.update(user);
        if(updated) {
            return user;
        } else {
            throw new RuntimeException("Update failed");
        }
    }

    public boolean changePassword(Long userId, ChangePasswordRequest req) {
        User user = getProfile(userId);
        String oldPassword = req.getOldPassword();

        boolean isPasswordMatch = BCrypt.checkpw(oldPassword, user.getPasswordHash());
        if(isPasswordMatch) {
            String newPassword = BCrypt.hashpw(req.getNewPassword(), BCrypt.gensalt());
            user.setPasswordHash(newPassword);
            boolean updated = userDAO.update(user);
            if(updated) {
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
        return addressDAO.findByUserId(userId);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        User user = getProfile(userId);

        Address address = new Address();
        address.setReceiverName(req.getReceiverName());
        address.setReceiverPhone(req.getReceiverPhone());
        address.setCountry(req.getCountry());
        address.setProvince(req.getProvince());
        address.setDistrict(req.getDistrict());
        address.setWard(req.getWard());
        address.setStreetDetail(req.getStreetDetail());
        address.setIsDefault(req.getIsDefault() != null && req.getIsDefault());

        // Bind user for address
        address.setUser(user);

        boolean saved = addressDAO.save(address);
        if (!saved) {
            throw new RuntimeException("Add address failed");
        }
        return address;
    }

    public boolean deleteAddress(Long userId, Long addressId) {
        Optional<Address> addrOpt = addressDAO.findById(addressId);
        if (addrOpt.isEmpty()) {
            throw new IllegalArgumentException("Address not found");
        }

        Address address = addrOpt.get();
        // Security: Identify the User who want to delete address
        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: Not your address");
        }

        boolean deleted = addressDAO.deleteById(addressId);
        if (!deleted) {
            throw new RuntimeException("Delete address failed");
        }
        return true;
    }


}
