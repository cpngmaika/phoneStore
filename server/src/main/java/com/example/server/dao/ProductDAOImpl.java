package com.example.server.dao;

import com.example.server.model.Product;
import com.example.server.util.DBConnection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ProductDAOImpl implements ProductDAO {

    private EntityManager entityManager;

    public ProductDAOImpl() {
    }

    public ProductDAOImpl(EntityManager entityManager) {
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
    public Optional<Product> findById(Long id) {
        if (id == null) return Optional.empty();
        EntityManager em = getEntityManager();
        try {
            Product product = em.find(Product.class, id);
            return Optional.ofNullable(product);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        if (sku == null || sku.trim().isEmpty()) return Optional.empty();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p WHERE p.sku = :sku", Product.class);
            query.setParameter("sku", sku.trim());
            List<Product> list = query.getResultList();
            return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Product> findAll() {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p ORDER BY p.id DESC", Product.class);
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Product> findAll(int offset, int limit) {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p ORDER BY p.id DESC", Product.class);
            query.setFirstResult(Math.max(0, offset));
            query.setMaxResults(Math.max(1, limit));
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Product> findByCategory(String category) {
        if (category == null || category.trim().isEmpty()) return new ArrayList<>();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p WHERE UPPER(str(p.category)) = :cat ORDER BY p.id DESC", Product.class);
            query.setParameter("cat", category.trim().toUpperCase());
            return query.getResultList();
        } catch (Exception e) {
            try {
                TypedQuery<Product> query = em.createQuery(
                        "SELECT p FROM Product p WHERE p.category = :cat ORDER BY p.id DESC", Product.class);
                query.setParameter("cat", category.trim());
                return query.getResultList();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    @Override
    public List<Product> findByBrandId(Integer brandId) {
        if (brandId == null) return new ArrayList<>();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p WHERE p.brand.id = :bId ORDER BY p.id DESC", Product.class);
            query.setParameter("bId", brandId);
            return query.getResultList();
        } catch (Exception e) {
            try {
                TypedQuery<Product> query = em.createQuery(
                        "SELECT p FROM Product p WHERE p.brandId = :bId ORDER BY p.id DESC", Product.class);
                query.setParameter("bId", brandId);
                return query.getResultList();
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    @Override
    public List<Product> searchByName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return findAll();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Product> query = em.createQuery(
                    "SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(:kw) ORDER BY p.id DESC", Product.class);
            query.setParameter("kw", "%" + keyword.trim() + "%");
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean save(Product product) {
        if (product == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(product);
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
    public boolean update(Product product) {
        if (product == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(product);
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
    public boolean updateStatus(Long productId, String status) {
        if (productId == null || status == null) return false;
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            int rows = em.createQuery("UPDATE Product p SET p.status = :status WHERE p.id = :id")
                    .setParameter("status", status)
                    .setParameter("id", productId)
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
            Product product = em.find(Product.class, id);
            if (product != null) {
                em.remove(product);
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
    public int count() {
        EntityManager em = getEntityManager();
        try {
            Long total = em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult();
            return total != null ? total.intValue() : 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
