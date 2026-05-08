package com.example.Backend_2026.controller.client;

import com.example.Backend_2026.infrastructure.response.OrderDetailResponse;
import com.example.Backend_2026.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // danh sách các đơn mua
    @GetMapping("/my")
    public List<OrderDetailResponse> getMyOrders(@RequestParam Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    //chi tiết đơn
    @GetMapping("/{id}")
    public OrderDetailResponse getDetail(@PathVariable Long id) {
        return orderService.getOrderDetail(id);
    }
}