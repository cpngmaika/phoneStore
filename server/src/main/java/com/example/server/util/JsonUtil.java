package com.example.server.util;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

/** Reads JSON from a request and writes JSON to a response (Gson). */
public final class JsonUtil {

    private static final Gson GSON = new Gson();

    private JsonUtil() {
    }

    /** Parses the request body; throws IllegalArgumentException if it is empty or invalid. */
    public static <T> T readJson(HttpServletRequest req, Class<T> type) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        if (sb.toString().isBlank()) {
            throw new IllegalArgumentException("Request body is required");
        }
        try {
            T value = GSON.fromJson(sb.toString(), type);
            if (value == null) {
                throw new IllegalArgumentException("Request body is required");
            }
            return value;
        } catch (JsonSyntaxException e) {
            throw new IllegalArgumentException("Invalid JSON body");
        }
    }

    /** Writes the object as UTF-8 JSON with the given HTTP status. */
    public static void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(GSON.toJson(body));
        resp.getWriter().flush();
    }
}
