package com.example.Backend_2026.infrastructure.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamClientListResponse {


    private Long id;
    private String ten;
    private String hinhAnh;
    private BigDecimal giaMin;
    private BigDecimal giaMax;

    private Long thuongHieuId;   // ✅ thêm
    private String thuongHieuTen;

    private Long xuatXuId;       // ✅ thêm
    private String xuatXuTen;
}
