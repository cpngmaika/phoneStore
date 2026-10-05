package com.example.server.dao;

import com.example.server.model.User;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class UserDAOImpl implements UserDAO {

    private EntityManager entityManager;

    public UserDAOImpl() {
    }

    public UserDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    protected EntityManager getEntityManager() {
        if (this.entityManager != null && this.entityManager.isOpen()) {
            return this.entityManager;
        }

        try {
            java.lang.reflect.Method method = DBConnection.class.getMethod("getEntityManager");
            Object result = method.invoke(null);
            if (result instanceof EntityManager) {
                this.entityManager = (EntityManager) result;
                return this.entityManager;
            }
        } catch (Exception ignored) {
        }

        try {
            EntityManagerFactory emf = Persistence.createEntityManagerFactory("PhoneStorePU");
            this.entityManager = emf.createEntityManager();
            return this.entityManager;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Optional<User> findById(Long id) {
        if (id == null) return Optional.empty();
        EntityManager em = getEntityManager();
        try {
            User user = em.find(User.class, id);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) return Optional.empty();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE LOWER(u.email) = :email", User.class);
            query.setParameter("email", email.trim().toLowerCase());
            List<User> list = query.getResultList();
            return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<User> findByPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) return Optional.empty();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE u.phone = :phone", User.class);
            query.setParameter("phone", phone.trim());
            List<User> list = query.getResultList();
            return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<User> findAll() {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u ORDER BY u.id DESC", User.class);
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean save(User user) {
        if (user == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(user);
            tx.commit();
            return true;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean update(User user) {
        if (user == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(user);
            tx.commit();
            return true;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updatePassword(Long userId, String newPasswordHash) {
        if (userId == null || newPasswordHash == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            int rows = em.createQuery("UPDATE User u SET u.passwordHash = :newPwd WHERE u.id = :id")
                    .setParameter("newPwd", newPasswordHash)
                    .setParameter("id", userId)
                    .executeUpdate();
            tx.commit();
            return rows > 0;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updateStatus(Long userId, String status) {
        if (userId == null || status == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            int rows = em.createQuery("UPDATE User u SET u.status = :status WHERE u.id = :id")
                    .setParameter("status", status)
                    .setParameter("id", userId)
                    .executeUpdate();
            tx.commit();
            return rows > 0;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deleteById(Long id) {
        if (id == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            User user = em.find(User.class, id);
            if (user != null) {
                em.remove(user);
                tx.commit();
                return true;
            }
            tx.rollback();
            return false;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        if (email == null) return false;
        EntityManager em = getEntityManager();
        try {
            Long count = em.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE LOWER(u.email) = :email", Long.class)
                    .setParameter("email", email.trim().toLowerCase())
                    .getSingleResult();
            return count != null && count > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean existsByPhone(String phone) {
        if (phone == null) return false;
        EntityManager em = getEntityManager();
        try {
            Long count = em.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE u.phone = :phone", Long.class)
                    .setParameter("phone", phone.trim())
                    .getSingleResult();
            return count != null && count > 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
