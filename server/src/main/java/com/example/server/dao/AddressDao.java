package com.example.server.dao;

import com.example.server.model.Address;
import jakarta.persistence.EntityManager;

import java.util.List;

public class AddressDao extends BaseDao<Address, Long> {

    public AddressDao() {
        super(Address.class);
    }

    public List<Address> findByUserId(Long userId) {
        if (userId == null) {
            return List.of();
        }
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT a FROM Address a WHERE a.user.id = :userId", Address.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}
