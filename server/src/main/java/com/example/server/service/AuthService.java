package com.example.server.service;

import com.example.server.dao.UserDao;
import com.example.server.dao.impl.UserDaoImpl;
import com.example.server.dto.auth.LoginRequest;
import com.example.server.dto.auth.RegisterRequest;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import com.example.server.util.ValidationUtil;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

public class AuthService {
    private final UserDao userDao;

    public AuthService() {
        this.userDao = new UserDaoImpl();
    }

    public AuthService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User register(RegisterRequest request) {
        ValidationUtil.validateFullName(request.getFullName());
        ValidationUtil.validateEmail(request.getEmail());
        ValidationUtil.validatePassword(request.getPassword());
        ValidationUtil.validatePhone(request.getPhone(), false);

        if (userDao.existsByEmail(request.getEmail().trim())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

        User newUser = new User(
                request.getFullName().trim(),
                request.getEmail().trim(),
                hashedPassword,
                request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null,
                Role.CUSTOMER,
                UserStatus.ACTIVE
        );

        User savedUser = userDao.save(newUser);
        if (savedUser == null) {
            throw new RuntimeException("System Error! Cannot register user");
        }
        return savedUser;
    }

    public User login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        Optional<User> userOpt = userDao.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email does not exist");
        }

        User user = userOpt.get();

        boolean isPasswordMatch = BCrypt.checkpw(request.getPassword(), user.getPasswordHash());
        if (user.getStatus() != null && user.getStatus() == UserStatus.LOCKED) {
            throw new RuntimeException("Your account has been locked");
        }
        if (user.getStatus() != null && user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Your account is inactive");
        }
        if (!isPasswordMatch) {
            throw new RuntimeException("Password does not match");
        }

        return user;
    }
}
