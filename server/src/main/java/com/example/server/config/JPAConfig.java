package com.example.server.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class JPAConfig {

    private static final EntityManagerFactory emf;

    static {
        Map<String, String> properties = new HashMap<>();

        try (InputStream input =
                     JPAConfig.class.getClassLoader()
                             .getResourceAsStream("db.properties")) {

            if (input != null) {
                Properties prop = new Properties();
                prop.load(input);

                properties.put(
                        "jakarta.persistence.jdbc.url",
                        prop.getProperty("db.url")
                );

                properties.put(
                        "jakarta.persistence.jdbc.user",
                        prop.getProperty("db.user")
                );

                properties.put(
                        "jakarta.persistence.jdbc.password",
                        prop.getProperty("db.password")
                );

                properties.put(
                        "jakarta.persistence.jdbc.driver",
                        prop.getProperty("db.driver")
                );
            }

            emf = Persistence.createEntityManagerFactory(
                    "PhoneStorePU",
                    properties
            );

        } catch (Exception ex) {
            System.err.println(
                    "Lỗi khởi tạo EntityManagerFactory: "
                            + ex.getMessage()
            );

            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    public static void shutdown() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}