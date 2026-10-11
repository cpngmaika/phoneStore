package com.example.server.dao;

import com.example.server.model.WarrantyPolicy;

public class WarrantyPolicyDao extends BaseDao<WarrantyPolicy, Long> {

    public WarrantyPolicyDao() {
        super(WarrantyPolicy.class);
    }
}
