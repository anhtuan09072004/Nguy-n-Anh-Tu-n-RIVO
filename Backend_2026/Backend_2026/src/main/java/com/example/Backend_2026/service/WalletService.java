package com.example.Backend_2026.service;

import com.example.Backend_2026.entity.GiaoDich;
import com.example.Backend_2026.infrastructure.response.KiemTraSoDuResponse;

import java.math.BigDecimal;
import java.util.List;

public interface WalletService {
    void napTien(Long userId, BigDecimal amount);

    BigDecimal getSoDu(Long taiKhoanId);

    List<GiaoDich> getLichSu(Long taiKhoanId);

    void truTien(Long taiKhoanId, BigDecimal soTien, Long hoaDonId);

    KiemTraSoDuResponse kiemTraSoDu(Long userId, BigDecimal soTienCan);
}
