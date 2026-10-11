package com.example.server.controller;

import com.example.server.dto.ApiResponse;
import com.example.server.dto.LoginRequest;
import com.example.server.dto.RegisterRequest;
import com.example.server.model.User;
import com.example.server.service.AuthService;
import com.example.server.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {
    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String path = req.getPathInfo();
        if(path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
        try {
            switch(path) {
                case "/register":
                    RegisterRequest registerReq = JsonUtil.toObject(req, RegisterRequest.class);

                    User newUser = authService.register(registerReq);

                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("Registration Successfully", newUser));
                    break;
                case "/login":
                    LoginRequest loginReq = JsonUtil.toObject(req, LoginRequest.class);

                    User user = authService.login(loginReq);

                    req.getSession().setAttribute("currentUser", user);

                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Login Successfully", user));
                    break;
                case "/logout":
                    req.getSession().invalidate();

                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Logout Successfully", null));
                    break;
                default:
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
                    break;
            }
        } catch(Exception e){
            JsonUtil.sendJson(resp, 400,ApiResponse.error(e.getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        if("/me".equals(path)){
            User currentUser = (User)req.getSession().getAttribute("currentUser");

            if(currentUser != null){
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Login Success", currentUser));
            } else {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Not logged in"));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }

}
