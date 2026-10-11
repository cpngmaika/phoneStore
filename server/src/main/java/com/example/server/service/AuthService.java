package com.example.server.service;

import com.example.server.dao.UserDAO;
import com.example.server.dao.impl.UserDAOImpl;
import com.example.server.dto.LoginRequest;
import com.example.server.dto.RegisterRequest;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

public class AuthService {
    private final UserDAO userDAO;

    // Generate new DAO
    public AuthService() {
        this.userDAO = new UserDAOImpl();
    }

    // Use for mock test
    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User register(RegisterRequest request) {

        if(userDAO.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(hashedPassword);
        newUser.setPhone(request.getPhone());
        newUser.setRole(Role.CUSTOMER);
        newUser.setStatus(UserStatus.ACTIVE);

        boolean isSaved = userDAO.save(newUser);
        if(!isSaved) {
            throw new RuntimeException("System Error! Cannot register user");
        }
        return newUser;

    }

    public User login(LoginRequest request) {
        Optional<User> userOpt = userDAO.findByEmail(request.getEmail());
        if(userOpt.isEmpty()) {
            throw new RuntimeException("Email does not exist");
        }
            User user = userOpt.get();

            boolean isPasswordMatch = BCrypt.checkpw(request.getPassword(), user.getPasswordHash());
            if (user.getStatus().equals(UserStatus.LOCKED)) {
                throw new RuntimeException("Your account has been locked");
            }
            if(!isPasswordMatch){
                throw new RuntimeException("Password does not match");
            }

        return user;
    }
}
