package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.BrandDao;
import com.example.server.model.Brand;

import java.util.Optional;

public class BrandDaoImpl extends BaseDao<Brand, Long> implements BrandDao {

    public BrandDaoImpl() {
        super(Brand.class);
    }

    @Override
    public Optional<Brand> findOptionalById(Long id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public boolean deleteById(Long id) {
        return super.deleteById(id);
    }
}