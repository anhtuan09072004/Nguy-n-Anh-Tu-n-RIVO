package com.example.Backend_2026.infrastructure.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class SanPhamResponse {

    private Long id;

    private String ten;
    private String ma;
    private String moTa;

    private SimpleResponse chatLieu;
    private SimpleResponse thuongHieu;
    private SimpleResponse xuatXu;
    private SimpleResponse coAo;
    private SimpleResponse tayAo;

    private Boolean daXoa;

    private String hinhAnh; // ✅ NEW

    private BigDecimal giaMin; // ✅ NEW
    private BigDecimal giaMax; // ✅ NEW

    private LocalDateTime taoLuc;
    private LocalDateTime capNhatLuc;

    private String taoBoi;
    private String capNhatBoi;
}
