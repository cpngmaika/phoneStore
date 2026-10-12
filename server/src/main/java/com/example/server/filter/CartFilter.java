package com.example.server.filter;

import com.example.server.dto.common.ApiResponse;
import com.example.server.service.CartService;
import com.example.server.util.JsonUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/api/cart/*")
public class CartFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse resp = (HttpServletResponse) response;

        try {
            chain.doFilter(request, response);
        } catch (CartService.UnauthorizedException e) {
            sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
        } catch (CartService.NotFoundException e) {
            sendError(resp, HttpServletResponse.SC_NOT_FOUND, e.getMessage());
        } catch (CartService.BadRequestException e) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (NumberFormatException e) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid item id");
        } catch (JsonProcessingException e) {
            sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid request body");
        } catch (Exception e) {
            request.getServletContext().log("Unexpected error while handling a cart request", e);
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    private void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        if (resp.isCommitted()) {
            return;
        }
        resp.resetBuffer();
        JsonUtil.sendJson(resp, status, ApiResponse.error(message));
    }
}
