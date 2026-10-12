package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.user.UserCreateRequest;
import com.example.server.dto.user.UserResponse;
import com.example.server.dto.user.UserUpdateRequest;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import com.example.server.service.UserService;
import com.example.server.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/users/*")
public class AdminUserServlet extends HttpServlet {
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        try {
            // 1 Specific User's Detail
            if ("/detail".equals(path)) {
                String idParam = req.getParameter("id");
                if (idParam == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing id parameter"));
                    return;
                }
                Long userId = Long.parseLong(idParam);
                UserResponse user = userService.getUserById(userId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get user detail successfully", user));
                return;
            }

            // GET User List
            // Endpoint: GET /api/admin/users or GET /api/admin/users/
            if (path == null || "/".equals(path)) {
                String keyword = req.getParameter("keyword");
                String roleParam = req.getParameter("role");
                String statusParam = req.getParameter("status");

                Role role = (roleParam != null && !roleParam.trim().isEmpty()) ? Role.valueOf(roleParam.trim()) : null;
                UserStatus status = (statusParam != null && !statusParam.trim().isEmpty()) ? UserStatus.valueOf(statusParam.trim()) : null;

                List<UserResponse> users = userService.getAllUsers(keyword, role, status);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get users successfully", users));
                return;
            }

            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        } catch (Exception e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        // Retrieve current logged-in Admin from Session
        User currentAdmin = (User) req.getSession().getAttribute("currentUser");

        try {
            switch (path) {
                // 1. Create a new staff / admin: POST /api/admin/users/create
                case "/create":
                    UserCreateRequest createReq = JsonUtil.toObject(req, UserCreateRequest.class);
                    UserResponse newUser = userService.createUserByAdmin(createReq);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("User created successfully", newUser));
                    break;

                // 2. Update user info / change role / change status: POST /api/admin/users/update?id=...
                case "/update":
                    String idParam = req.getParameter("id");
                    if (idParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing id parameter"));
                        return;
                    }
                    Long userId = Long.parseLong(idParam);
                    UserUpdateRequest updateReq = JsonUtil.toObject(req, UserUpdateRequest.class);

                    UserResponse updatedUser = userService.updateUserByAdmin(userId, updateReq, currentAdmin.getId());
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("User updated successfully", updatedUser));
                    break;

                // 3. Quick lock / unlock account: POST /api/admin/users/toggle-status?id=...&status=LOCKED
                case "/toggle-status":
                    String toggleIdParam = req.getParameter("id");
                    String statusParam = req.getParameter("status");
                    if (toggleIdParam == null || statusParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing id or status parameter"));
                        return;
                    }
                    Long toggleUserId = Long.parseLong(toggleIdParam);
                    UserStatus newStatus = UserStatus.valueOf(statusParam.trim());

                    UserResponse toggledUser = userService.toggleUserStatus(toggleUserId, newStatus, currentAdmin.getId());
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("User status updated successfully", toggledUser));
                    break;

                default:
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
                    break;
            }
        } catch (Exception e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
}