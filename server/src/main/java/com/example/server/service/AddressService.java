package com.example.server.service;

import com.example.server.dao.AddressDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.AddressDaoImpl;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.user.AddressRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.util.ValidationUtil;

import java.util.List;

public class AddressService {
    private final AddressDao addressDao;
    private final UserDao userDao;

    public AddressService() {
        this.addressDao = new AddressDaoImpl();
        this.userDao = new UserDaoImpl();
    }

    public AddressService(AddressDao addressDao, UserDao userDao) {
        this.addressDao = addressDao;
        this.userDao = userDao;
    }

    public List<Address> getAddresses(Long userId) {
        return addressDao.findByUserId(userId);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        ValidationUtil.validateFullName(req.getReceiverName());
        ValidationUtil.validatePhone(req.getReceiverPhone(), true);

        if (req.getProvince() == null || req.getProvince().trim().isEmpty() ||
                req.getDistrict() == null || req.getDistrict().trim().isEmpty() ||
                req.getWard() == null || req.getWard().trim().isEmpty() ||
                req.getStreetDetail() == null || req.getStreetDetail().trim().isEmpty()) {
            throw new IllegalArgumentException("Address details (province, district, ward, street) cannot be empty");
        }

        List<Address> existing = addressDao.findByUserId(userId);
        boolean isDefault = req.getIsDefault() != null && req.getIsDefault();

        // If user has no addresses yet, the first one is automatically default
        if (existing.isEmpty()) {
            isDefault = true;
        } else if (isDefault) {
            // Unset previous default address
            addressDao.resetDefaultAddress(userId);
        }

        String country = req.getCountry();
        if (country == null || country.trim().isEmpty()) {
            country = "Vietnam";
        }

        Address address = new Address(
                user,
                req.getReceiverName().trim(),
                req.getReceiverPhone().trim(),
                country.trim(),
                req.getProvince().trim(),
                req.getDistrict().trim(),
                req.getWard().trim(),
                req.getStreetDetail().trim(),
                isDefault
        );

        Address saved = addressDao.save(address);
        if (saved == null) {
            throw new RuntimeException("Add address failed");
        }
        return saved;
    }

    public void setDefaultAddress(Long userId, Long addressId) {
        Address address = addressDao.findById(addressId);
        if (address == null) {
            throw new IllegalArgumentException("Address not found");
        }

        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: Not your address");
        }

        addressDao.setDefaultAddress(userId, addressId);
    }

    public boolean deleteAddress(Long userId, Long addressId) {
        Address address = addressDao.findById(addressId);
        if (address == null) {
            throw new IllegalArgumentException("Address not found");
        }

        // Security check: verify address belongs to current user
        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: Not your address");
        }

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        boolean deleted = addressDao.deleteById(addressId);
        if (!deleted) {
            throw new RuntimeException("Delete address failed");
        }

        // If the deleted address was default, promote first remaining address to default
        if (wasDefault) {
            List<Address> remaining = addressDao.findByUserId(userId);
            if (!remaining.isEmpty()) {
                addressDao.setDefaultAddress(userId, remaining.get(0).getId());
            }
        }

        return true;
    }
}
