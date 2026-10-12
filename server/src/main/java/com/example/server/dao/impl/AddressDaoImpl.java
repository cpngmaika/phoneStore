package com.example.server.dao.impl;

import com.example.server.dao.AddressDao;
import com.example.server.dao.BaseDao;
import com.example.server.model.Address;
import jakarta.persistence.EntityManager;

import java.util.List;

public class AddressDaoImpl extends BaseDao<Address, Long> implements AddressDao {

    public AddressDaoImpl() {
        super(Address.class);
    }

    @Override
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

    @Override
    public void resetDefaultAddress(Long userId) {
        if (userId == null) {
            return;
        }
        EntityManager em = getEntityManager();
        try {
            em.getTransaction().begin();
            em.createQuery("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
                    .setParameter("userId", userId)
                    .executeUpdate();
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void setDefaultAddress(Long userId, Long addressId) {
        if (userId == null || addressId == null) {
            return;
        }
        EntityManager em = getEntityManager();
        try {
            em.getTransaction().begin();
            em.createQuery("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
                    .setParameter("userId", userId)
                    .executeUpdate();
            em.createQuery("UPDATE Address a SET a.isDefault = true WHERE a.user.id = :userId AND a.id = :addressId")
                    .setParameter("userId", userId)
                    .setParameter("addressId", addressId)
                    .executeUpdate();
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}
