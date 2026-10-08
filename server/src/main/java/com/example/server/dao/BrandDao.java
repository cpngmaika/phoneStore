package com.example.server.dao;

import com.example.server.model.Brand;

public class BrandDao extends BaseDao<Brand, Long> {

    public BrandDao() {
        super(Brand.class);
    }
}
