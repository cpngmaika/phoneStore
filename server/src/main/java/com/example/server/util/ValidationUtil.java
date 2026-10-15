package com.example.server.util;

import java.net.URI;
import java.util.regex.Pattern;

/**
 * Utility class for common backend validations.
 */
public final class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    // Vietnamese mobile phone numbers: 10 digits starting with 03, 05, 07, 08, 09
    private static final Pattern VIETNAMESE_PHONE_PATTERN = Pattern.compile(
            "^0(3|5|7|8|9)[0-9]{8}$"
    );

    private ValidationUtil() {
        // Utility class
    }

    public static void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("Email is invalid (e.g. user@domain.com)");
        }
    }

    public static void validateFullName(String fullName) {
        if (fullName == null || fullName.trim().length() < 2) {
            throw new IllegalArgumentException("Full name must have at least 2 characters");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.trim().length() < 8) {
            throw new IllegalArgumentException("Password must have at least 8 characters");
        }
    }

    public static void validatePhone(String phone, boolean required) {
        if (phone == null || phone.trim().isEmpty()) {
            if (required) {
                throw new IllegalArgumentException("Phone number cannot be empty");
            }
            return;
        }
        String cleaned = phone.trim();
        if (!VIETNAMESE_PHONE_PATTERN.matcher(cleaned).matches()) {
            throw new IllegalArgumentException("Phone number is invalid (must be 10 digits starting with 03, 05, 07, 08, 09)");
        }
    }

    public static void validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return;
        }
        try {
            java.net.URI uri = java.net.URI.create(url.trim());
            String scheme = uri.getScheme();
            if (scheme == null || (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme))) {
                throw new IllegalArgumentException("URL must start with http:// or https://");
            }
            if (uri.getHost() == null || uri.getHost().trim().isEmpty()) {
                throw new IllegalArgumentException("Invalid URL format");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL format");
        }
    }
}
