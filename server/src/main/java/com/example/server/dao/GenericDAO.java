
package com.example.server.dao;

import com.example.server.config.HibernateConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;

import java.util.List;

public class GenericDAO<T> {

    private final Class<T> lopThucThe;

    public GenericDAO(Class<T> lopThucThe) {
        this.lopThucThe = lopThucThe;
    }

    public T timTheoId(Object id) {
        EntityManager em = HibernateConfig.getEntityManager();

        try {
            return em.find(lopThucThe, id);
        } finally {
            em.close();
        }
    }

    public List<T> layTatCa() {
        EntityManager em = HibernateConfig.getEntityManager();

        try {
            String jpql = "SELECT t FROM "
                    + lopThucThe.getSimpleName() + " t";

            return em.createQuery(jpql, lopThucThe)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public T them(T doiTuong) {
        EntityManager em = HibernateConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();
            em.persist(doiTuong);
            transaction.commit();

            return doiTuong;
        } catch (RuntimeException e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public T capNhat(T doiTuong) {
        EntityManager em = HibernateConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();
            T ketQua = em.merge(doiTuong);
            transaction.commit();

            return ketQua;
        } catch (RuntimeException e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public boolean xoaTheoId(Object id) {
        EntityManager em = HibernateConfig.getEntityManager();
        EntityTransaction transaction = em.getTransaction();

        try {
            transaction.begin();

            T doiTuong = em.find(lopThucThe, id);

            if (doiTuong == null) {
                transaction.commit();
                return false;
            }

            em.remove(doiTuong);
            transaction.commit();

            return true;
        } catch (RuntimeException e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}
