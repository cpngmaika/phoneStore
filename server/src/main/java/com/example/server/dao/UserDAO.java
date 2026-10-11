package com.example.server.dao;

import com.example.server.model.User;

import java.util.Optional;

public interface UserDAO extends GenericDAO<User, Long> {

    // Login method
    Optional<User> findByEmail(String email);

    // Register method
    boolean existsByEmail(String email);

}
