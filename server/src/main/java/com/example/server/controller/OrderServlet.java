package com.example.server.controller;

import com.example.server.dao.impl.OrderDAOImpl;
import com.example.server.model.Order;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Comparator;
import com.example.server.model.Payment;
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
       
       List<Order> orders = orderDAO.findAllWithAmount();

        List<Map<String, Object>> result = orders.stream()
                .map(order -> {
                    Map<String, Object> data = new LinkedHashMap<>();

                    data.put("id", order.getId());
                    data.put("orderCode", order.getOrderCode());
                    data.put("status", order.getStatus());
                    data.put("userId", order.getUserId());
                    data.put("shippingAddressId", order.getShippingAddressId());

                    Payment payment = order.getPayments().stream()
                            .max(Comparator.comparing(Payment::getId))
                            .orElse(null);

                    data.put(
                            "amount",
                            payment != null ? payment.getAmount() : null
                    );

                    return data;
                })
                .toList();

        resp.getWriter().write(objectMapper.writeValueAsString(result));
    }
}