package com.example.server.util;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class AppContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("====================================================");
        System.out.println("[SERVER STARTUP] Initializing Database Connection...");
        System.out.println("====================================================");
        DBConnection.getEntityManagerFactory();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("[SERVER SHUTDOWN] Closing Database Connection...");
        DBConnection.close();
    }
}
