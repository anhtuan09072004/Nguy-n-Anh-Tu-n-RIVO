package com.example.Backend_2026.infrastructure.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class KiemTraSoDuRequest {
    private Long userId;
    private BigDecimal soTien;
}
