package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.UserDao;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class UserDaoImpl extends BaseDao<User, Long> implements UserDao {

    public UserDaoImpl() {
        super(User.class);
    }

    @Override
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

    @Override
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

    @Override
    public List<User> findByRole(Role role) {
        if (role == null) {
            return findAll();
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE u.role = :role ORDER BY u.id DESC", User.class);
            query.setParameter("role", role);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<User> findByStatus(UserStatus status) {
        if (status == null) {
            return findAll();
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE u.status = :status ORDER BY u.id DESC", User.class);
            query.setParameter("status", status);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<User> searchUsers(String keyword, Role role, UserStatus status) {
        EntityManager em = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT u FROM User u WHERE 1=1");
            if (keyword != null && !keyword.trim().isEmpty()) {
                jpql.append(" AND (LOWER(u.fullName) LIKE :kw OR LOWER(u.email) LIKE :kw OR u.phone LIKE :kw)");
            }
            if (role != null) {
                jpql.append(" AND u.role = :role");
            }
            if (status != null) {
                jpql.append(" AND u.status = :status");
            }
            jpql.append(" ORDER BY u.id DESC");

            TypedQuery<User> query = em.createQuery(jpql.toString(), User.class);
            if (keyword != null && !keyword.trim().isEmpty()) {
                query.setParameter("kw", "%" + keyword.trim().toLowerCase() + "%");
            }
            if (role != null) {
                query.setParameter("role", role);
            }
            if (status != null) {
                query.setParameter("status", status);
            }
            return query.getResultList();
        } finally {
            em.close();
        }
    }
}
