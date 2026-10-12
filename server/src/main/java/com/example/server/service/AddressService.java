package com.example.server.service;

import com.example.server.dao.AddressDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.user.AddressRequest;
import com.example.server.model.Address;
import com.example.server.model.User;

import java.util.List;

public class AddressService {
    private final AddressDao addressDao;
    private final UserDao userDao;

    public AddressService() {
        this.addressDao = new AddressDao();
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

        // Security check: verify address belongs to current user
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
