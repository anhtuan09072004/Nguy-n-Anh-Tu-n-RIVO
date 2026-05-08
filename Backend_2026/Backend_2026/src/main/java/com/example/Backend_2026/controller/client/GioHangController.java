package com.example.Backend_2026.controller.client;


import com.example.Backend_2026.infrastructure.request.AddToCartRequest;
import com.example.Backend_2026.infrastructure.response.CartResponse;
import com.example.Backend_2026.infrastructure.response.GioHangChiTietResponse;
import com.example.Backend_2026.service.GioHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/cart")
@RequiredArgsConstructor

public class GioHangController {
    private final GioHangService gioHangService;


    // thêm vào giỏ
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            gioHangService.addToCart(request);
            return ResponseEntity.ok("Thêm vào giỏ hàng thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // xem giỏ hàng
    @GetMapping
    public CartResponse getCart(@RequestParam Long userId) {
        return gioHangService.getCart(userId);
    }

    @PutMapping("/update")
    public void updateQuantity(
            @RequestParam Long id,
            @RequestParam Integer soLuong
    ) {
        gioHangService.updateQuantity(id, soLuong);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        gioHangService.deleteItem(id);
    }
}
