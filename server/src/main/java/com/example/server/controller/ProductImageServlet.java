package com.example.server.controller;

import com.example.server.model.ProductImage;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@WebServlet("/api/product-images/*")
public class ProductImageServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String filename = pathInfo == null || pathInfo.length() < 2
                ? null
                : pathInfo.substring(1);
        Path image = ProductImage.findStoredImage(filename);
        if (image == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        resp.setContentType(ProductImage.getStoredImageContentType(filename));
        resp.setContentLengthLong(Files.size(image));
        resp.setHeader("X-Content-Type-Options", "nosniff");
        resp.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        Files.copy(image, resp.getOutputStream());
    }
}
