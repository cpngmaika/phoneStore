package com.example.server.dao.impl;

import com.example.server.dao.AddressDAO;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.util.List;
import java.util.Optional;

public class AddressDAOImpl implements AddressDAO {
    
    // Transaction
    @Override
    public boolean save(Address address){
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try{
            tx.begin();
            em.persist(address);
            tx.commit();
            return true;
        } catch(Exception e){
            if(tx != null && tx.isActive()){
                tx.rollback();
            }
            e.printStackTrace();
            return false;
        } finally{
            em.close();
        }
    }

    @Override
    public boolean update(Address address){
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try{
            tx.begin();
            em.merge(address);
            tx.commit();
            return true;
        } catch(Exception e){
            if(tx != null && tx.isActive()){
                tx.rollback();
            }
            e.printStackTrace();
            return false;
        } finally{
            em.close();
        }
    }

    @Override
    public boolean deleteById(Long id){
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try{
            tx.begin();
            Address address = em.find(Address.class, id);
            em.remove(address);
            tx.commit();
            return true;
        }  catch(Exception e){
            if(tx != null && tx.isActive()){
                tx.rollback();
            }
            e.printStackTrace();
            return false;
        } finally{
            em.close();
        }
    }

    // NO Transaction
    @Override
    public Optional<Address> findById(Long id){
        EntityManager em = DBConnection.getEntityManager();
        try {
            Address address = em.find(Address.class, id);
            return Optional.ofNullable(address);
        } finally {
            em.close();
        }
    }

    @Override
    public List<Address> findByUserId(Long userId) {
        EntityManager em = DBConnection.getEntityManager();
        try {
            return em.createQuery("SELECT a FROM Address a WHERE a.user.id = :userId", Address.class)
                    .setParameter("userId", userId).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Address> findAll() {
        EntityManager em = DBConnection.getEntityManager();
        try {
            return em.createQuery("SELECT a FROM Address a", Address.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}


