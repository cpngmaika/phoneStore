package com.example.server.filter;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@WebFilter("/*")
public class CorsFilter implements Filter {

    private static final Set<String> ALLOWED_ORIGINS = resolveAllowedOrigins();

    private static Set<String> resolveAllowedOrigins() {
        String configured = System.getenv("FRONTEND_ORIGINS");
        if (configured == null || configured.isBlank()) {
            try {
                Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
                configured = dotenv.get("FRONTEND_ORIGINS");
            } catch (Exception ignored) {
            }
        }
        if (configured == null || configured.isBlank()) {
            configured = "http://localhost:3000";
        }
        return Arrays.stream(configured.split(","))
                .map(String::trim)
                .filter((origin) -> !origin.isEmpty())
                .map(CorsFilter::normalizeOrigin)
                .collect(Collectors.toSet());
    }

    private static String normalizeOrigin(String origin) {
        String normalized = origin;
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        String origin = request.getHeader("Origin");
        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
        }
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        // Return 200 OK immediately for Preflight Request (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}
