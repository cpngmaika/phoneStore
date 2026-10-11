package com.example.server.dao;

import com.example.server.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.Optional;

public class UserDao extends BaseDao<User, Long> {

    public UserDao() {
        super(User.class);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)",
                    User.class
            );
            query.setParameter("email", email.trim());
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    public boolean existsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Long> query = em.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE LOWER(u.email) = LOWER(:email)",
                    Long.class
            );
            query.setParameter("email", email.trim());
            return query.getSingleResult() > 0;
        } finally {
            em.close();
        }
    }
}
