package com.example.server.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class DBConnection {

    private static final String PERSISTENCE_UNIT_NAME = "PhoneStorePU";
    private static EntityManagerFactory emf;

    static {
        initEntityManagerFactory();
    }

    private static void initEntityManagerFactory() {
        Properties properties = new Properties();
        Map<String, String> config = new HashMap<>();

        try (InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                properties.load(input);
                String url = properties.getProperty("db.url");
                String user = properties.getProperty("db.username");
                String pass = properties.getProperty("db.password");

                System.out.println("================ DB CONNECTION INFO ================");
                System.out.println("Loaded db.properties successfully!");
                System.out.println("DB URL      : " + url);
                System.out.println("DB Username : " + user);
                System.out.println("====================================================");

                if (url != null) config.put("jakarta.persistence.jdbc.url", url);
                if (user != null) config.put("jakarta.persistence.jdbc.user", user);
                if (pass != null) config.put("jakarta.persistence.jdbc.password", pass);
            } else {
                System.out.println("[DBConnection] Warning: db.properties file not found in resources!");
            }
        } catch (Exception e) {
            System.err.println("[DBConnection] Error loading db.properties: " + e.getMessage());
        }

        try {
            if (!config.isEmpty()) {
                emf = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME, config);
            } else {
                emf = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
            }
            System.out.println("[DBConnection] JPA EntityManagerFactory initialized successfully!");
        } catch (Exception ex) {
            System.err.println("[DBConnection] JPA EntityManagerFactory initialization failed: " + ex.getMessage());
        }
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    public static EntityManager getEntityManager() {
        if (emf != null && emf.isOpen()) {
            return emf.createEntityManager();
        }
        return null;
    }

    public static void close() {
        if (emf != null && emf.isOpen()) {
            emf.close();
            System.out.println("[DBConnection] JPA EntityManagerFactory closed.");
        }
    }
}
