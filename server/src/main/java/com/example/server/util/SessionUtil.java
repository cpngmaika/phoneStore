package com.example.server.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/** Resolves the current user from the request. */
public final class SessionUtil {

    /** Session attribute that the login flow must set (as a Long). */
    public static final String USER_ID_ATTRIBUTE = "userId";

    private SessionUtil() {
    }

    /**
     * Returns the logged-in user's id, or null when nobody is logged in.
     * Falls back to the X-User-Id header to make API testing easy.
     * Development only: the header can be forged, remove it once real login exists.
     */
    public static Long getUserId(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null && session.getAttribute(USER_ID_ATTRIBUTE) instanceof Number id) {
            return id.longValue();
        }
        String header = req.getHeader("X-User-Id");
        if (header != null) {
            try {
                return Long.parseLong(header.trim());
            } catch (NumberFormatException ignored) {
                // invalid header => treated as not logged in
            }
        }
        return null;
    }
}
