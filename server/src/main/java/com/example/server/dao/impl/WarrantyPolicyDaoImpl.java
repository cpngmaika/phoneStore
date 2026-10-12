package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.WarrantyPolicyDao;
import com.example.server.model.WarrantyPolicy;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import java.util.Optional;

public class WarrantyPolicyDaoImpl extends BaseDao<WarrantyPolicy, Long> implements WarrantyPolicyDao {

    public WarrantyPolicyDaoImpl() {
        super(WarrantyPolicy.class);
    }

    @Override
    public Optional<WarrantyPolicy> findOptionalById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        EntityManager em = getEntityManager();
        try {
            WarrantyPolicy policy = em.find(WarrantyPolicy.class, id);
            return Optional.ofNullable(policy);
        } finally {
            em.close();
        }
    }

    @Override
    public boolean hasReferences(Long policyId) {
        EntityManager em = getEntityManager();
        try {
            Long count = em.createQuery(
                            "SELECT COUNT(p) FROM Product p WHERE p.warrantyPolicy.id = :policyId",
                            Long.class
                    )
                    .setParameter("policyId", policyId)
                    .getSingleResult();
            return count > 0;
        } finally {
            em.close();
        }
    }
}