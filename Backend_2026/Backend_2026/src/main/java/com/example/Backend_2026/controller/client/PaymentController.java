package com.example.Backend_2026.controller.client;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.infrastructure.request.ThanhToanRequest;
import com.example.Backend_2026.service.CheckoutService;
import com.example.Backend_2026.service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final VnPayService vnPayService;
    private final CheckoutService checkoutService;

    @PostMapping("/vnpay/{userId}")
    public ResponseEntity<?> createVnpay(
            @PathVariable Long userId,
            @RequestBody ThanhToanRequest request,
            HttpServletRequest httpRequest
    ) throws Exception {

        HoaDon hoaDon = checkoutService.createPendingOrder(userId, request);

        String paymentUrl = vnPayService.createPaymentUrl(
                hoaDon.getId(),
                hoaDon.getTongTien().longValue(),
                httpRequest
        );

        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public void vnpayReturn(
            @RequestParam Map<String, String> params,
            jakarta.servlet.http.HttpServletResponse response
    ) throws Exception {

        String responseCode = params.get("vnp_ResponseCode");
        Long orderId = Long.valueOf(params.get("vnp_TxnRef"));

        if ("00".equals(responseCode)) {
            checkoutService.paymentSuccess(orderId);
            response.sendRedirect("http://localhost:5174/orders?payment=success");
        } else {
            checkoutService.paymentFailed(orderId);
            response.sendRedirect("http://localhost:5174/orders?payment=failed");
        }
    }
}
