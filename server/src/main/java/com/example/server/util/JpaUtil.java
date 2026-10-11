package com.example.server.util;

import com.example.server.config.JPAConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;

import java.util.function.Function;

public class JpaUtil {

    public static <T> T executeInTransaction(Function<EntityManager, T> action) {
        return executeInTransaction(JPAConfig.getEntityManagerFactory(), action);
    }

    public static <T> T executeInTransaction(
            EntityManagerFactory emf,
            Function<EntityManager, T> action
    ) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T result = action.apply(em);
            tx.commit();
            return result;
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}