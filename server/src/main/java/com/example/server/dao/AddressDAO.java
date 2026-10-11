package com.example.server.dao;

import com.example.server.model.Address;

import java.util.List;

public interface AddressDAO extends GenericDAO<Address, Long>{

    public List<Address> findByUserId(Long userId);
}
