package com.example.server.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class JsonUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> T toObject(HttpServletRequest request, Class<T> clazz) throws IOException {
        return mapper.readValue(request.getReader(), clazz);
    }

    public static void sendJson(HttpServletResponse response, int statusCode, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(statusCode);
        response.getWriter().write(mapper.writeValueAsString(data));
        response.getWriter().flush();
    }

}
