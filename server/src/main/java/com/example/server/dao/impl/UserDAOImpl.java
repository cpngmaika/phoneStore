package com.example.server.dao.impl;

import com.example.server.dao.UserDAO;
import com.example.server.model.User;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.util.List;
import java.util.Optional;

public class UserDAOImpl implements UserDAO {

    // Transaction
    @Override
    public boolean save(User user){
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try{
            tx.begin();
            em.persist(user);
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
    public boolean update(User user){
        EntityManager em = DBConnection.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try{
            tx.begin();
            em.merge(user);
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
            User user = em.find(User.class, id);
            em.remove(user);
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
    public Optional<User> findById(Long id){
        EntityManager em = DBConnection.getEntityManager();
        try {
            User user = em.find(User.class, id);
            return Optional.ofNullable(user);
        } finally {
            em.close();
        }
    }

    @Override
    public boolean existsByEmail(String email){
        EntityManager em = DBConnection.getEntityManager();
        try{
            return findByEmail(email).isPresent();
        } finally {
            em.close();
        }
    }

    @Override
    public List<User> findAll(){
        EntityManager em = DBConnection.getEntityManager();
        try{
            return em.createQuery("SELECT u FROM User u").getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<User> findByEmail(String email){
        EntityManager em = DBConnection.getEntityManager();
        try {
            List<User> users = em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", email)
                    .getResultList();
            return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
        } finally {
            em.close();
        }
    }
}
