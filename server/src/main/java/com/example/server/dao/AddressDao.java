package com.example.server.dao;

import com.example.server.model.Address;

import java.util.List;

public class AddressDao extends BaseDao<Address, Long> {

    public AddressDao() {
        super(Address.class);
    }

    public List<Address> findByUserId(Long userId) {
        return List.of();
    }
}
