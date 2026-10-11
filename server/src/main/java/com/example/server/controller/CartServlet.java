package com.example.server.controller;

import com.example.server.dto.cart.CartItemRequest;
import com.example.server.dto.cart.UpdateItemRequest;
import com.example.server.dto.common.ApiResponse;
import com.example.server.service.CartService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

    private final CartService cartService = new CartService();

    /** A unit of request work that may throw. */
    private interface Action {
        void run() throws Exception;
    }

    /** Error that carries the HTTP status to return. */
    private static class HttpError extends RuntimeException {
        private static final long serialVersionUID = 1L;
        final int status;

        HttpError(int status, String message) {
            super(message);
            this.status = status;
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        handle(req, resp, () -> {
            String[] seg = segments(req);
            if (seg.length != 0) throw notFound();
            Long userId = requireUserId(req);
            JsonUtil.writeJson(resp, 200, ApiResponse.success("OK", cartService.getCartByUserId(userId)));
        });
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        handle(req, resp, () -> {
            String[] seg = segments(req);
            if (seg.length != 1 || !"items".equals(seg[0])) throw notFound();
            Long userId = requireUserId(req);
            CartItemRequest body = JsonUtil.readJson(req, CartItemRequest.class);
            JsonUtil.writeJson(resp, 200, ApiResponse.success("Item added to cart",
                    cartService.addToCart(userId, body.getProductId(), body.getQuantity())));
        });
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        handle(req, resp, () -> {
            String[] seg = segments(req);
            if (seg.length != 2 || !"items".equals(seg[0])) throw notFound();
            Long userId = requireUserId(req);
            UpdateItemRequest body = JsonUtil.readJson(req, UpdateItemRequest.class);
            JsonUtil.writeJson(resp, 200, ApiResponse.success("Cart updated",
                    cartService.updateQuantity(userId, parseId(seg[1]), body.getQuantity())));
        });
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        handle(req, resp, () -> {
            String[] seg = segments(req);
            if (seg.length == 1 && "clear".equals(seg[0])) {
                cartService.clearCart(requireUserId(req));
                JsonUtil.writeJson(resp, 200, ApiResponse.success("Cart cleared", null));
            } else if (seg.length == 2 && "items".equals(seg[0])) {
                Long userId = requireUserId(req);
                JsonUtil.writeJson(resp, 200, ApiResponse.success("Item removed",
                        cartService.removeItem(userId, parseId(seg[1]))));
            } else {
                throw notFound();
            }
        });
    }


    /** Central error handling: HttpError => its status, IllegalArgumentException => 400, else 500. */
    private void handle(HttpServletRequest req, HttpServletResponse resp, Action action) throws IOException {
        try {
            req.setCharacterEncoding("UTF-8");
            action.run();
        } catch (HttpError e) {
            JsonUtil.writeJson(resp, e.status, ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            JsonUtil.writeJson(resp, 400, ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log("Cart request failed", e);
            JsonUtil.writeJson(resp, 500, ApiResponse.error("Internal server error"));
        }
    }

    private Long requireUserId(HttpServletRequest req) {
        Long userId = SessionUtil.getUserId(req);
        if (userId == null) {
            throw new HttpError(401, "Unauthorized");
        }
        return userId;
    }

    /** "/items/5" => ["items", "5"]; null or "/" => []. */
    private String[] segments(HttpServletRequest req) {
        String path = req.getPathInfo();
        return (path == null || path.equals("/")) ? new String[0] : path.substring(1).split("/");
    }

    private HttpError notFound() {
        return new HttpError(404, "Endpoint not found");
    }

    private long parseId(String s) {
        try {
            return Long.parseLong(s);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid id: " + s);
        }
    }
}
