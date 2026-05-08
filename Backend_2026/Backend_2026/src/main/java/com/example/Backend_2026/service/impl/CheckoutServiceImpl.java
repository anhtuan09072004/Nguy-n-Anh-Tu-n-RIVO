package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.*;
import com.example.Backend_2026.infrastructure.constant.TrangThaiHoaDonConstant;
import com.example.Backend_2026.infrastructure.request.ThanhToanRequest;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import com.example.Backend_2026.repository.*;
import com.example.Backend_2026.service.CheckoutService;
import com.example.Backend_2026.service.EmailService;
import com.example.Backend_2026.service.ThanhToanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final GioHangRepository gioHangRepo;
    private final GioHangChiTietRepository ghctRepo;
    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository ctRepo;
    private final ThanhToanService thanhToanService;
    private final VoucherRepository voucherRepo;
    private final SanPhamChiTietRepository sanPhamChiTietRepository;
    private final EmailService emailService;

    private String genMaHoaDon() {
        return "HD" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    @Override
    @Transactional
    public HoaDonResponse checkout(Long userId, ThanhToanRequest request) {

        // ======================
        // 1. VALIDATE
        // ======================
        if (request == null) throw new RuntimeException("Request không hợp lệ");

        if (request.getPhuongThuc() == null)
            throw new RuntimeException("Chưa chọn phương thức thanh toán");

        if (request.getTenKhachHang() == null || request.getTenKhachHang().isBlank())
            throw new RuntimeException("Chưa nhập tên");

        if (request.getSdt() == null || !request.getSdt().matches("^0\\d{9}$"))
            throw new RuntimeException("SĐT không hợp lệ");

        if (request.getDiaChiCuThe() == null ||
                request.getXa() == null ||
                request.getHuyen() == null ||
                request.getTinh() == null)
            throw new RuntimeException("Thiếu địa chỉ");

        // ======================
        // 2. LẤY GIỎ HÀNG
        // ======================
        GioHang gh = gioHangRepo.findByTaiKhoanId(userId)
                .orElseThrow(() -> new RuntimeException("Không có giỏ hàng"));

        List<GioHangChiTiet> list = ghctRepo.findByGioHangId(gh.getId());

        if (list.isEmpty())
            throw new RuntimeException("Giỏ hàng trống");

        // ======================
        // 3. TÍNH TIỀN HÀNG
        // ======================
        BigDecimal tongTienHang = BigDecimal.ZERO;

        for (GioHangChiTiet item : list) {
            SanPhamChiTiet sp = item.getSanPhamChiTiet();

            if (sp == null) throw new RuntimeException("SP không tồn tại");
            if (Boolean.TRUE.equals(sp.getDaXoa()))
                throw new RuntimeException("SP ngừng bán");

            if (sp.getSoLuong() < item.getSoLuong()) {
                throw new RuntimeException(
                        sp.getSanPham().getTen() + " không đủ số lượng"
                );
            }
            BigDecimal gia = sp.getGia();
            BigDecimal sl = BigDecimal.valueOf(item.getSoLuong());

            tongTienHang = tongTienHang.add(gia.multiply(sl));
        }

        // ======================
        // 4. SHIP + VOUCHER
        // ======================
        BigDecimal tienShip = BigDecimal.valueOf(30000);
        BigDecimal tienGiam = BigDecimal.ZERO;
        Voucher voucher = null;

        if (request.getVoucherId() != null) {
            voucher = voucherRepo.findById(request.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

            // validate cơ bản
            if (voucher.getTrangThai() != 1)
                throw new RuntimeException("Voucher không hoạt động");

            if (voucher.getNgayKetThuc() != null &&
                    voucher.getNgayKetThuc().isBefore(LocalDateTime.now()))
                throw new RuntimeException("Voucher hết hạn");

            if (voucher.getGiaTriToiThieu() != null &&
                    tongTienHang.compareTo(voucher.getGiaTriToiThieu()) < 0)
                throw new RuntimeException("Chưa đủ giá trị đơn");

            // tính giảm
            if (voucher.getPhanTramGiam() != null) {
                tienGiam = tongTienHang
                        .multiply(voucher.getPhanTramGiam())
                        .divide(BigDecimal.valueOf(100));

                if (voucher.getGiaTriToiDa() != null &&
                        tienGiam.compareTo(voucher.getGiaTriToiDa()) > 0) {
                    tienGiam = voucher.getGiaTriToiDa();
                }
            } else if (voucher.getGiaTriToiDa() != null) {
                tienGiam = voucher.getGiaTriToiDa();
            }

            // không cho giảm quá tổng
            BigDecimal max = tongTienHang.add(tienShip);
            if (tienGiam.compareTo(max) > 0) {
                tienGiam = max;
            }
        }

        // ======================
        // 5. TỔNG THANH TOÁN
        // ======================
        BigDecimal thanhToan = tongTienHang
                .add(tienShip)
                .subtract(tienGiam);

        if (thanhToan.compareTo(BigDecimal.ZERO) < 0) {
            thanhToan = BigDecimal.ZERO;
        }

        // ======================
        // 6. TẠO HÓA ĐƠN
        // ======================
        HoaDon hd = new HoaDon();

        hd.setMa(genMaHoaDon());
        hd.setKhachHang(gh.getTaiKhoan());
        hd.setNgayThanhToan(LocalDateTime.now());
        hd.setKieuHoaDon(1);
        hd.setTrangThai(TrangThaiHoaDonConstant.CHO_XAC_NHAN);


        hd.setTenKhachHang(request.getTenKhachHang());
        hd.setPhoneNumber(request.getSdt());
        hd.setEmail(request.getEmail());

        hd.setDiaChi(
                request.getDiaChiCuThe() + ", " +
                        request.getXa() + ", " +
                        request.getHuyen() + ", " +
                        request.getTinh()
        );

        hd.setTongTien(thanhToan);
        hd.setTienShip(tienShip);
        hd.setTienGiam(tienGiam);

        if (voucher != null) {
            hd.setVoucher(voucher);
        }

        hoaDonRepo.save(hd);

        // ======================
        // 7. CHI TIẾT + TRỪ KHO
        // ======================
        for (GioHangChiTiet item : list) {
            SanPhamChiTiet sp = item.getSanPhamChiTiet();

            sp.setSoLuong(sp.getSoLuong() - item.getSoLuong());
            sanPhamChiTietRepository.save(sp);

            HoaDonChiTiet ct = new HoaDonChiTiet();
            ct.setHoaDon(hd);
            ct.setChiTietSanPham(sp);
            ct.setSoLuong(item.getSoLuong());
            ct.setGia(sp.getGia());

            ctRepo.save(ct);
        }

        // 8. Thanh toan , trừ tien
        HoaDonResponse response = HoaDonResponse.builder()
                .id(hd.getId())
                .maHoaDon(hd.getMa())
                .tongTien(hd.getTongTien())
                .tienGiam(hd.getTienGiam())
                .tienShip(hd.getTienShip())
                .trangThai(hd.getTrangThai())
                .tenKhachHang(hd.getTenKhachHang())
                .sdt(hd.getPhoneNumber())
                .kieuHoaDon(1)
                .taoLuc(hd.getTaoLuc())
                .build();
        // ======================
        // 9. CLEAR GIỎ
        // ======================
        ghctRepo.deleteAll(list);

        try {
            emailService.sendOrderSuccess(hd);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    @Override
    @Transactional
    public HoaDon createPendingOrder(Long userId, ThanhToanRequest request) {
        GioHang gh = gioHangRepo.findByTaiKhoanId(userId)
                .orElseThrow(() -> new RuntimeException("Không có giỏ hàng"));

        List<GioHangChiTiet> list = ghctRepo.findByGioHangId(gh.getId());

        if (list.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }

        BigDecimal tongTienHang = BigDecimal.ZERO;

        for (GioHangChiTiet item : list) {
            SanPhamChiTiet sp = item.getSanPhamChiTiet();

            if (sp == null) throw new RuntimeException("SP không tồn tại");
            if (Boolean.TRUE.equals(sp.getDaXoa()))
                throw new RuntimeException("SP ngừng bán");

            if (sp.getSoLuong() < item.getSoLuong())
                throw new RuntimeException("Không đủ hàng");

            tongTienHang = tongTienHang.add(
                    sp.getGia().multiply(BigDecimal.valueOf(item.getSoLuong()))
            );
        }

        BigDecimal tienShip = BigDecimal.valueOf(30000);
        BigDecimal tienGiam = BigDecimal.ZERO;
        Voucher voucher = null;

        if (request.getVoucherId() != null) {
            voucher = voucherRepo.findById(request.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

            if (voucher.getTrangThai() != 1) {
                throw new RuntimeException("Voucher không hoạt động");
            }

            if (voucher.getNgayKetThuc() != null &&
                    voucher.getNgayKetThuc().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher hết hạn");
            }

            if (voucher.getGiaTriToiThieu() != null &&
                    tongTienHang.compareTo(voucher.getGiaTriToiThieu()) < 0) {
                throw new RuntimeException("Chưa đủ giá trị đơn");
            }

            if (voucher.getPhanTramGiam() != null) {
                tienGiam = tongTienHang
                        .multiply(voucher.getPhanTramGiam())
                        .divide(BigDecimal.valueOf(100));

                if (voucher.getGiaTriToiDa() != null &&
                        tienGiam.compareTo(voucher.getGiaTriToiDa()) > 0) {
                    tienGiam = voucher.getGiaTriToiDa();
                }
            } else if (voucher.getGiaTriToiDa() != null) {
                tienGiam = voucher.getGiaTriToiDa();
            }

            BigDecimal max = tongTienHang.add(tienShip);
            if (tienGiam.compareTo(max) > 0) {
                tienGiam = max;
            }
        }

        BigDecimal thanhToan = tongTienHang
                .add(tienShip)
                .subtract(tienGiam);

        if (thanhToan.compareTo(BigDecimal.ZERO) < 0) {
            thanhToan = BigDecimal.ZERO;
        }

        HoaDon hd = new HoaDon();

        hd.setMa(genMaHoaDon());
        hd.setKhachHang(gh.getTaiKhoan());
        hd.setKieuHoaDon(1);

        hd.setTrangThai(TrangThaiHoaDonConstant.CHO_THANH_TOAN);

        hd.setTenKhachHang(request.getTenKhachHang());
        hd.setPhoneNumber(request.getSdt());
        hd.setEmail(request.getEmail());

        hd.setDiaChi(
                request.getDiaChiCuThe() + ", " +
                        request.getXa() + ", " +
                        request.getHuyen() + ", " +
                        request.getTinh()
        );

        hd.setTongTien(thanhToan);
        hd.setTienShip(tienShip);
        hd.setTienGiam(tienGiam);

        if (voucher != null) {
            hd.setVoucher(voucher);
        }

        hoaDonRepo.save(hd);

        for (GioHangChiTiet item : list) {
            HoaDonChiTiet ct = new HoaDonChiTiet();

            ct.setHoaDon(hd);
            ct.setChiTietSanPham(item.getSanPhamChiTiet());
            ct.setSoLuong(item.getSoLuong());
            ct.setGia(item.getSanPhamChiTiet().getGia());

            ctRepo.save(ct);
        }

        return hd;
    }

    @Override
    @Transactional
    public void paymentSuccess(Long orderId) {
        HoaDon hd = hoaDonRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        if (hd.getTrangThai() != TrangThaiHoaDonConstant.CHO_THANH_TOAN) {
            return;
        }

        List<HoaDonChiTiet> chiTietList = ctRepo.findByHoaDonId(hd.getId());

        for (HoaDonChiTiet ct : chiTietList) {
            SanPhamChiTiet sp = ct.getChiTietSanPham();

            if (sp.getSoLuong() < ct.getSoLuong()) {
                throw new RuntimeException("Sản phẩm không đủ tồn kho");
            }

            sp.setSoLuong(sp.getSoLuong() - ct.getSoLuong());
            sanPhamChiTietRepository.save(sp);
        }

        GioHang gh = gioHangRepo.findByTaiKhoanId(hd.getKhachHang().getId())
                .orElse(null);

        if (gh != null) {
            List<GioHangChiTiet> cartItems = ghctRepo.findByGioHangId(gh.getId());
            ghctRepo.deleteAll(cartItems);
        }

        hd.setTrangThai(TrangThaiHoaDonConstant.CHO_XAC_NHAN);
        hd.setNgayThanhToan(LocalDateTime.now());

        hoaDonRepo.save(hd);
        try {
            emailService.sendOrderSuccess(hd);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public void paymentFailed(Long orderId) {
        HoaDon hd = hoaDonRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        if (hd.getTrangThai() != TrangThaiHoaDonConstant.CHO_THANH_TOAN) {
            return;
        }

        hd.setTrangThai(TrangThaiHoaDonConstant.DA_HUY);

        hoaDonRepo.save(hd);
    }
}