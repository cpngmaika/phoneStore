package com.example.server.exception;

public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
}