package com.example.Backend_2026.infrastructure.response;

import lombok.Data;

@Data
public class FilterSanPhamChiTietResponse {
    private Long id;
    private String tenSanPham;
    private String mauSac;
    private String kichCo;
    private Double gia;
    private Integer soLuong;
    private String hinhAnh;
}
