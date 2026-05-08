package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.*;
import com.example.Backend_2026.infrastructure.constant.TrangThaiHoaDonConstant;
import com.example.Backend_2026.infrastructure.converter.ThanhToanConverter;
import com.example.Backend_2026.infrastructure.request.ThanhToanRequest;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import com.example.Backend_2026.repository.*;
import com.example.Backend_2026.service.ThanhToanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ThanhToanServiceImpl implements ThanhToanService {
    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository ctRepo;
    private final SanPhamChiTietRepository spctRepo;
    private final VoucherRepository voucherRepo;
    private final ThanhToanRepository thanhToanRepo;
    private final LichSuHoaDonRepository lichSuRepo;
    private final ThanhToanConverter converter;
    private final TaiKhoanRepository taiKhoanRepo;

    private String genMaHoaDon() {
        return "HD" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    }

@Override
@Transactional
public HoaDonResponse thanhToan(ThanhToanRequest request) {

    // 1lấy hóa don + sản phẩm chi tiết
    HoaDon hd = hoaDonRepo.findById(request.getHoaDonId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

    List<HoaDonChiTiet> list = ctRepo.findByHoaDonId(hd.getId());

    if (list.isEmpty()) {
        throw new RuntimeException("Hóa đơn chưa có sản phẩm");
    }

    // 2 lấy tổng tiền

    BigDecimal tongTien = list.stream()
            .map(i -> i.getGia().multiply(BigDecimal.valueOf(i.getSoLuong())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal giamGia = BigDecimal.ZERO;
    Voucher vc = null;

    // ======================
    // 3. VOUCHER (CHỈ TÍNH 1 LẦN)
    // ======================
    if (request.getVoucherId() != null) {
        vc = voucherRepo.findById(request.getVoucherId())
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        if (vc.getGiaTriToiThieu() != null &&
                tongTien.compareTo(vc.getGiaTriToiThieu()) < 0) {
            throw new RuntimeException("Không đủ điều kiện dùng voucher");
        }

        if (vc.getSoLuong() <= 0) {
            throw new RuntimeException("Voucher đã hết lượt sử dụng");
        }

        if (vc.getPhanTramGiam() != null) {
            giamGia = tongTien
                    .multiply(vc.getPhanTramGiam())
                    .divide(BigDecimal.valueOf(100));

            if (vc.getGiaTriToiDa() != null &&
                    giamGia.compareTo(vc.getGiaTriToiDa()) > 0) {
                giamGia = vc.getGiaTriToiDa();
            }
        }
    }

    // ======================
    // 4. THÀNH TIỀN
    // ======================
//    BigDecimal thanhTien = tongTien.subtract(giamGia);
    BigDecimal phiShip = request.getPhiShip() != null
            ? request.getPhiShip()
            : BigDecimal.ZERO;
    hd.setTienShip(phiShip);

    BigDecimal thanhTien = tongTien
            .subtract(giamGia)
            .add(phiShip);

    // ======================
    // 5. VALIDATE TIỀN
    // ======================
    if (request.getPhuongThuc() == 1) {
        if (request.getTienKhachDua() == null ||
                request.getTienKhachDua().compareTo(thanhTien) < 0) {
            throw new RuntimeException("Tiền khách không đủ");
        }
    }

    // ======================
    // 6. TRỪ KHO
    // ======================
    for (HoaDonChiTiet ct : list) {
        SanPhamChiTiet sp = spctRepo.findByIdForUpdate(
                ct.getChiTietSanPham().getId()
        );

        if (sp.getSoLuong() < ct.getSoLuong()) {
            throw new RuntimeException( "Sản phẩm " + sp.getSanPham().getTen() +
                    " chỉ còn " + sp.getSoLuong());
        }

        if (sp.getDaXoa()) {
            throw new RuntimeException("Sản phẩm đã ngừng bán");
        }

        sp.setSoLuong(sp.getSoLuong() - ct.getSoLuong());
        spctRepo.save(sp);
    }

    // ======================
    // 7. SET KHÁCH HÀNG
    // ======================
    if (request.getCustomerId() != null) {
        TaiKhoan kh = taiKhoanRepo.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        hd.setKhachHang(kh); // nhớ sửa kiểu dữ liệu bên Hóa Đơn
    } else {
        //  fallback khách lẻ (ví dụ id = 1)
        TaiKhoan khLe = taiKhoanRepo.findById(1L).orElse(null);
        hd.setKhachHang(khLe);
    }

    // ======================
    // 8. UPDATE HÓA ĐƠN
    // ======================
    hd.setTongTien(thanhTien);
    hd.setTienGiam(giamGia);
    hd.setTienShip(phiShip);
    if (request.getKieuHoaDon() == 0) {
        hd.setTrangThai(TrangThaiHoaDonConstant.HOAN_THANH);
    } else {
        hd.setTrangThai(TrangThaiHoaDonConstant.DA_XAC_NHAN);
    }
    hd.setNgayThanhToan(LocalDateTime.now());
    hd.setKieuHoaDon(request.getKieuHoaDon());

    hd.setTenKhachHang(request.getTenKhachHang());
    hd.setPhoneNumber(request.getSdt());
    hd.setEmail(request.getEmail());
    hd.setGhiChu(request.getGhiChu());
    hd.setMa(genMaHoaDon());

    // ======================
    // 9. ĐỊA CHỈ
    // ======================
    if (request.getKieuHoaDon() == 1) {
        hd.setDiaChi(
                request.getDiaChiCuThe() + ", " +
                        request.getXa() + ", " +
                        request.getHuyen() + ", " +
                        request.getTinh()
        );
    }

    // ======================
    // 10. SET + TRỪ VOUCHER
    // ======================
    if (vc != null) {
        hd.setVoucher(vc); // 🔥 FIX CHÍNH

        vc.setSoLuong(vc.getSoLuong() - 1);
        voucherRepo.save(vc);
    }

    hoaDonRepo.save(hd);
    List<HoaDonChiTiet> newList = ctRepo.findFullByHoaDonId(hd.getId());

    // ======================
    // 11. LƯU THANH TOÁN
    // ======================
    ThanhToan tt = new ThanhToan();
    tt.setHoaDon(hd);
    tt.setPhuongThuc(request.getPhuongThuc());
    tt.setTongTien(thanhTien);
    tt.setTrangThai(true);

    thanhToanRepo.save(tt);

    // ======================
    // 12. LỊCH SỬ
    // ======================
    LichSuHoaDon ls = new LichSuHoaDon();
    ls.setHoaDon(hd);
    ls.setTrangThai(hd.getTrangThai());
    ls.setGhiChu("Thanh toán thành công");

    lichSuRepo.save(ls);

    return converter.toResponse(hd, newList);
}
}
