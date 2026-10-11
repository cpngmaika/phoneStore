package com.example.server.controller;

import com.example.server.dao.impl.OrderDAOImpl;
import com.example.server.model.Order;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/orders")
public class OrderServlet extends HttpServlet {
    private final OrderDAOImpl orderDAO = new OrderDAOImpl();

    // Sử dụng Jackson ObjectMapper thay cho Gson
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        List<Order> orders = orderDAO.findAll();

        // Chuyển đổi danh sách đơn hàng sang JSON mượt mà
        resp.getWriter().write(objectMapper.writeValueAsString(orders));
    }
}