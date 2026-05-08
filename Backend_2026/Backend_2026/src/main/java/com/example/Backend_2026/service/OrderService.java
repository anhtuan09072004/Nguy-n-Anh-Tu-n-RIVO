package com.example.Backend_2026.service;

import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import com.example.Backend_2026.infrastructure.response.OrderDetailResponse;

import java.util.List;

public interface OrderService {
    List<OrderDetailResponse> getOrdersByUser(Long userId);

    OrderDetailResponse getOrderDetail(Long orderId);
}
