package com.example.Backend_2026.service;

import jakarta.servlet.http.HttpServletRequest;

public interface VnPayService {
    String createPaymentUrl(Long orderId, Long amount, HttpServletRequest request) throws Exception;
}
