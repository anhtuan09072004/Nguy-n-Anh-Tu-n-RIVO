package com.example.Backend_2026.infrastructure.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderDetailResponse {

    private Long id;
    private String ma;
    private BigDecimal tongTien;
    private BigDecimal tienGiam;
    private BigDecimal tienShip;

    private Integer trangThai;

    private String tenKhachHang;
    private String sdt;
    private String email;
    private String diaChi;

    private List<Item> items;

    @Data
    @Builder
    public static class Item {
        private String tenSanPham;
        private String mauSac;
        private String kichCo;
        private Integer soLuong;
        private BigDecimal gia;
    }
}