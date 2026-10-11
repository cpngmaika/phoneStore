package com.example.server.controller;

import com.example.server.dto.AddressRequest;
import com.example.server.dto.ApiResponse;
import com.example.server.dto.ChangePasswordRequest;
import com.example.server.dto.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.service.UserService;
import com.example.server.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/user/*")
public class UserServlet extends HttpServlet {
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        if(path == null){
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }
        User currentUser = (User) req.getSession().getAttribute("currentUser");

        if(currentUser == null){
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        if("/profile".equals(path)){


            try {
                User user = userService.getProfile(currentUser.getId());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get profile successfully", user));
            } catch (Exception e){
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }

        }else if("/addresses".equals(path)){

            try {
                List<Address> addresses = userService.getAddresses(currentUser.getId());

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
        if(path == null){
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        User currentUser = (User) req.getSession().getAttribute("currentUser");
        if(currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }
        switch(path){
            case "/profile":

                try {
                    UpdateProfileRequest updateReq = JsonUtil.toObject(req, UpdateProfileRequest.class);

                    User updatedUser = userService.updateProfile(currentUser.getId(), updateReq);

                    req.getSession().setAttribute("currentUser", updatedUser);

                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Update profile successfully", updatedUser));
                } catch(Exception e){
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/change-password":
                try {
                    ChangePasswordRequest passReq = JsonUtil.toObject(req, ChangePasswordRequest.class);

                    boolean isPassChanged = userService.changePassword(currentUser.getId(), passReq);
                    if(isPassChanged){
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Change password successfully", null));
                    }
                } catch (IllegalArgumentException e){
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                }
                catch(Exception e){
                    e.printStackTrace();
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses": // Add new address

                try {
                    AddressRequest addrReq = JsonUtil.toObject(req, AddressRequest.class);
                    Address newAddress = userService.addAddress(currentUser.getId(), addrReq);

                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("Address added successfully", newAddress));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses/delete": // Delete Address based on Id on URL (EX: /addresses/delete?id=1)
                try {
                    String idParam = req.getParameter("id");
                    if (idParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id parameter"));
                        break;
                    }
                    Long addressId = Long.parseLong(idParam);
                    userService.deleteAddress(currentUser.getId(), addressId);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Address deleted successfully", null));
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
}
