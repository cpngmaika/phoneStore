package com.example.server.dao;

import com.example.server.model.User;

import java.util.List;
import java.util.Optional;

public interface UserDAO {

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    List<User> findAll();

    boolean save(User user);

    boolean update(User user);

    boolean updatePassword(Long userId, String newPasswordHash);

    boolean updateStatus(Long userId, String status);

    boolean deleteById(Long id);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
