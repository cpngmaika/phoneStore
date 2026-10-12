package com.example.server.dao;

import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;

import java.util.List;
import java.util.Optional;

public interface UserDao extends GenericDao<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByStatus(UserStatus status);

    List<User> searchUsers(String keyword, Role role, UserStatus status);
}
