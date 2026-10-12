package com.example.server.controller;

import com.example.server.dto.cart.CartDTO;
import com.example.server.dto.cart.CartItemRequest;
import com.example.server.dto.cart.UpdateItemRequest;
import com.example.server.dto.common.ApiResponse;
import com.example.server.model.User;
import com.example.server.service.CartService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private static final String ITEMS_PREFIX = "/items/";

    private final CartService cartService = new CartService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Long userId = currentUserId(req);
        String path = req.getPathInfo();

        if (path == null || "/".equals(path)) {
            CartDTO cart = cartService.getCart(userId);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.success("Cart retrieved successfully", cart));
            return;
        }
        throw new CartService.NotFoundException("Endpoint not found");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Long userId = currentUserId(req);

        if ("/items".equals(req.getPathInfo())) {
            CartItemRequest body = JsonUtil.toObject(req, CartItemRequest.class);
            CartDTO cart = cartService.addItem(userId, body);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.success("Item added to cart", cart));
            return;
        }
        throw new CartService.NotFoundException("Endpoint not found");
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Long userId = currentUserId(req);
        String path = req.getPathInfo();

        if (path != null && path.startsWith(ITEMS_PREFIX)) {
            Long itemId = Long.parseLong(path.substring(ITEMS_PREFIX.length()));
            UpdateItemRequest body = JsonUtil.toObject(req, UpdateItemRequest.class);
            CartDTO cart = cartService.updateItem(userId, itemId, body);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.success("Cart item updated", cart));
            return;
        }
        throw new CartService.NotFoundException("Endpoint not found");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Long userId = currentUserId(req);
        String path = req.getPathInfo();

        if ("/clear".equals(path)) {
            CartDTO cart = cartService.clearCart(userId);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.success("Cart cleared", cart));
            return;
        }
        if (path != null && path.startsWith(ITEMS_PREFIX)) {
            Long itemId = Long.parseLong(path.substring(ITEMS_PREFIX.length()));
            CartDTO cart = cartService.removeItem(userId, itemId);
            JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.success("Item removed from cart", cart));
            return;
        }
        throw new CartService.NotFoundException("Endpoint not found");
    }

     private Long currentUserId(HttpServletRequest req) {
        User user = SessionUtil.getLoggedInUser(req);
        if (user == null) {
            throw new CartService.UnauthorizedException("Unauthorized");
        }
        return user.getId();
    }
}
