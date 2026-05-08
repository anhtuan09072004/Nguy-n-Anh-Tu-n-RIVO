package com.example.Backend_2026.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ThanhToanRequest {
    private Long hoaDonId;
    private Long voucherId;
    private Integer phuongThuc; // 1: tiền mặt, 2: chuyển khoản
    private BigDecimal tienKhachDua;

    private Integer kieuHoaDon; // 0: tại quầy, 1: giao hàng

    private String tenKhachHang;
    private String sdt;
    private String email;

    private String tinh;
    private String huyen;
    private String xa;
    private String diaChiCuThe;
    private BigDecimal phiShip;
    private String ghiChu;
    private Long customerId;
}
