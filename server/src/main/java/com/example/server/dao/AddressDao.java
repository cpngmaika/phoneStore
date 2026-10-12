package com.example.server.dao;

import com.example.server.model.Address;

import java.util.List;

public interface AddressDao extends GenericDao<Address, Long> {

    List<Address> findByUserId(Long userId);

    void resetDefaultAddress(Long userId);

    void setDefaultAddress(Long userId, Long addressId);

    boolean deleteById(Long id);
}
