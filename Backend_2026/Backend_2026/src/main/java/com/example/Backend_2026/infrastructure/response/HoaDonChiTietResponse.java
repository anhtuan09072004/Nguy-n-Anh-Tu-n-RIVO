package com.example.Backend_2026.infrastructure.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class HoaDonChiTietResponse {
    private Long id;
    private Long hoaDonId;
    private Long chiTietSanPhamId;
    private String tenSanPham;
    private Integer soLuong;
    private Integer soLuongTon;
    private BigDecimal thanhTien;
    private BigDecimal gia;
    private String hinhAnh;
    private String mauSac;
    private String kichCo;
    private LocalDateTime taoLuc;
}
