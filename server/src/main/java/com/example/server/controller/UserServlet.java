package com.example.server.controller;

import com.example.server.dto.auth.ChangePasswordRequest;
import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.user.AddressRequest;
import com.example.server.dto.user.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.service.AddressService;
import com.example.server.service.UserService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/user/*", "/api/users/*"})
public class UserServlet extends HttpServlet {
    private final UserService userService = new UserService();
    private final AddressService addressService = new AddressService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        if ("/profile".equals(path)) {
            try {
                User user = userService.getProfile(currentUser.getId());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get profile successfully", user));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else if ("/addresses".equals(path)) {
            try {
                List<Address> addresses = addressService.getAddresses(currentUser.getId());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get addresses successfully", addresses));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        switch (path) {
            case "/profile":
                try {
                    UpdateProfileRequest updateReq = JsonUtil.toObject(req, UpdateProfileRequest.class);
                    User updatedUser = userService.updateProfile(currentUser.getId(), updateReq);
                    SessionUtil.setLoggedInUser(req, updatedUser);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Update profile successfully", updatedUser));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/change-password":
                try {
                    ChangePasswordRequest passReq = JsonUtil.toObject(req, ChangePasswordRequest.class);
                    boolean isPassChanged = userService.changePassword(currentUser.getId(), passReq);
                    if (isPassChanged) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Change password successfully", null));
                    }
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses":
                try {
                    AddressRequest addrReq = JsonUtil.toObject(req, AddressRequest.class);
                    Address newAddress = addressService.addAddress(currentUser.getId(), addrReq);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("Address added successfully", newAddress));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses/delete":
                try {
                    String idParam = req.getParameter("id");
                    if (idParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id parameter"));
                        break;
                    }
                    Long addressId = Long.parseLong(idParam);
                    addressService.deleteAddress(currentUser.getId(), addressId);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Address deleted successfully", null));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses/set-default":
                try {
                    String idParam = req.getParameter("id");
                    if (idParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id parameter"));
                        break;
                    }
                    Long addressId = Long.parseLong(idParam);
                    addressService.setDefaultAddress(currentUser.getId(), addressId);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Default address updated successfully", null));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            default:
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
                break;
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        // Support DELETE /addresses/{id} or /addresses?id={id}
        if (path != null && path.startsWith("/addresses")) {
            try {
                Long addressId = null;
                if (path.length() > "/addresses/".length()) {
                    addressId = Long.parseLong(path.substring("/addresses/".length()));
                } else {
                    String idParam = req.getParameter("id");
                    if (idParam != null) {
                        addressId = Long.parseLong(idParam);
                    }
                }

                if (addressId == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id"));
                    return;
                }

                addressService.deleteAddress(currentUser.getId(), addressId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Address deleted successfully", null));
            } catch (IllegalArgumentException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }
}
