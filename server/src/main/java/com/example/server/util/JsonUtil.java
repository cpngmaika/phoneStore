package com.example.server.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class JsonUtil {

    private static final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public static <T> T toObject(HttpServletRequest request, Class<T> clazz) throws IOException {
        return mapper.readValue(request.getReader(), clazz);
    }

    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        return mapper.readValue(json, clazz);
    }

    public static String toJson(Object data) throws IOException {
        return mapper.writeValueAsString(data);
    }

    public static void sendJson(HttpServletResponse response, int statusCode, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(statusCode);
        response.getWriter().write(mapper.writeValueAsString(data));
        response.getWriter().flush();
    }
}
