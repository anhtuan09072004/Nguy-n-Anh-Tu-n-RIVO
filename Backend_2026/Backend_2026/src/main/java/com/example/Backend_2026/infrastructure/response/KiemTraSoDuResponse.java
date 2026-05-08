package com.example.Backend_2026.infrastructure.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KiemTraSoDuResponse {
    private BigDecimal soDu;
    private BigDecimal soTienCan;
    private boolean duTien;
}
