package com.example.server.filter;

import com.example.server.dto.ApiResponse;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.util.JsonUtil;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/api/user/*", "/api/admin/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter (ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        if("OPTIONS".equalsIgnoreCase(req.getMethod())){
            chain.doFilter(request, response);
            return;
        }

        User currentUser = (User) req.getSession().getAttribute("currentUser");
        if(currentUser == null){
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        String uri = req.getRequestURI();
        if(uri.contains("/api/admin/") && currentUser.getRole() != Role.ADMIN){
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN, ApiResponse.error("Access denied: Admin role required"));
            return;
        }

        chain.doFilter(request, response);
    }
}
