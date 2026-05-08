package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.GiaoDich;
import com.example.Backend_2026.entity.TaiKhoan;
import com.example.Backend_2026.infrastructure.response.KiemTraSoDuResponse;
import com.example.Backend_2026.repository.GiaoDichRepository;
import com.example.Backend_2026.repository.TaiKhoanRepository;
import com.example.Backend_2026.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalletServiceImpl implements WalletService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepo;

    @Autowired
    private GiaoDichRepository giaoDichRepo;
    @Override
    @Transactional
    public void napTien(Long userId, BigDecimal amount) {
        TaiKhoan user = taiKhoanRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số tiền không hợp lệ");
        }

        // 🔥 FIX NULL (quan trọng nhất)
        BigDecimal soDuHienTai = user.getSoDu() == null
                ? BigDecimal.ZERO
                : user.getSoDu();

        user.setSoDu(soDuHienTai.add(amount));

        // 🔥 nhớ save user (bạn đang thiếu dòng này)
        taiKhoanRepo.save(user);

        // lưu giao dịch
        GiaoDich gd = new GiaoDich();
        gd.setTaiKhoanId(userId);
        gd.setSoTien(amount);
        gd.setLoai("DEPOSIT");
        gd.setTrangThai(1);
        gd.setGhiChu("Nạp tiền");
        gd.setTaoLuc(LocalDateTime.now());

        giaoDichRepo.save(gd);
    }

    // ======================
    // LẤY SỐ DƯ
    // ======================
    @Override
    public BigDecimal getSoDu(Long taiKhoanId) {
        TaiKhoan user = taiKhoanRepo.findById(taiKhoanId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return user.getSoDu() == null ? BigDecimal.ZERO : user.getSoDu();
    }

    // ======================
    // LỊCH SỬ GIAO DỊCH
    // ======================
    @Override
    public List<GiaoDich> getLichSu(Long taiKhoanId) {
        return giaoDichRepo.findByTaiKhoanIdOrderByTaoLucDesc(taiKhoanId);
    }

    @Override
    @Transactional
    public void truTien(Long taiKhoanId, BigDecimal soTien, Long hoaDonId) {

        TaiKhoan user = taiKhoanRepo.findById(taiKhoanId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (soTien == null || soTien.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số tiền không hợp lệ");
        }

        if (user.getSoDu() == null || user.getSoDu().compareTo(soTien) < 0) {
            throw new RuntimeException("Không đủ tiền");
        }

        // 🔥 trừ tiền
        user.setSoDu(user.getSoDu().subtract(soTien));

        // 🔥 lưu giao dịch
        GiaoDich gd = new GiaoDich();
        gd.setTaiKhoanId(taiKhoanId);
        gd.setSoTien(soTien);
        gd.setLoai("PAYMENT");
        gd.setTrangThai(1);
        gd.setGhiChu("Thanh toán hóa đơn #" + hoaDonId);
        gd.setTaoLuc(LocalDateTime.now());

        giaoDichRepo.save(gd);
    }

    @Override
    public KiemTraSoDuResponse kiemTraSoDu(Long userId, BigDecimal soTienCan) {

        TaiKhoan user = taiKhoanRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        BigDecimal soDu = user.getSoDu();

        boolean duTien = soDu.compareTo(soTienCan) >= 0;

        KiemTraSoDuResponse res = new KiemTraSoDuResponse();
        res.setSoDu(soDu);
        res.setSoTienCan(soTienCan);
        res.setDuTien(duTien);

        return res;
    }
}
