package com.example.Backend_2026.infrastructure.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class GioHangChiTietResponse {
    private Long id;
    private Long chiTietSanPhamId;

    private Integer soLuong;
    private Integer tonKho;

    private Long sanPhamId;
    private String tenSanPham;

    private String mauSac;
    private String kichCo;

    private BigDecimal gia;

    private BigDecimal tongTien;

    private String hinhAnh;
}
