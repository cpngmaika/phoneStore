package com.example.server.dao;

import com.example.server.model.WarrantyPolicy;
import java.util.Optional;

public interface WarrantyPolicyDao extends GenericDao<WarrantyPolicy, Long> {
    Optional<WarrantyPolicy> findOptionalById(Long id);
    boolean hasReferences(Long policyId);
    boolean deleteById(Long id);
}