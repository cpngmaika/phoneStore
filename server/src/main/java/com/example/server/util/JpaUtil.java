package com.example.server.util;

import com.example.server.config.JPAConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

/**
 * Access point for the "PhoneStorePU" persistence unit. It reuses the single
 * EntityManagerFactory built by JPAConfig (db.properties, closed by AppContextListener).
 */
public final class JpaUtil {

    private JpaUtil() {
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return JPAConfig.getEntityManagerFactory();
    }

    /** Returns a new EntityManager; the caller must close it. */
    public static EntityManager getEntityManager() {
        return JPAConfig.getEntityManager();
    }
}
