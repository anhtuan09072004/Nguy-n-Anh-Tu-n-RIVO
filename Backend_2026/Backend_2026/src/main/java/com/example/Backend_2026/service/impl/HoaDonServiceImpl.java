package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.entity.HoaDonChiTiet;
import com.example.Backend_2026.entity.SanPhamChiTiet;
import com.example.Backend_2026.entity.Voucher;
import com.example.Backend_2026.infrastructure.constant.TrangThaiHoaDonConstant;
import com.example.Backend_2026.infrastructure.converter.HoaDonChiTietConverter;
import com.example.Backend_2026.infrastructure.converter.HoaDonConverter;
import com.example.Backend_2026.infrastructure.request.*;
import com.example.Backend_2026.infrastructure.response.HoaDonChiTietResponse;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import com.example.Backend_2026.repository.HoaDonChiTietRepository;
import com.example.Backend_2026.repository.HoaDonRepository;
import com.example.Backend_2026.repository.SanPhamChiTietRepository;
import com.example.Backend_2026.repository.VoucherRepository;
import com.example.Backend_2026.service.HoaDonService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HoaDonServiceImpl implements HoaDonService {

    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository ctRepo;
    private final SanPhamChiTietRepository spctRepo;
    private final VoucherRepository voucherRepo;
    private final HoaDonConverter converter;
    private final HoaDonChiTietConverter chiTietConverter;

    @Autowired
    private HoaDonChiTietConverter hoaDonChiTietConverter;
        @Override
        public HoaDonResponse createHoaDon(HoaDonRequest request) {

            HoaDon hd = new HoaDon();

            Integer type = request.getKieuHoaDon();

            // 🚨 tránh null
            if (type == null) {
                throw new RuntimeException("Kiểu hóa đơn không được null");
                // hoặc: type = 0; // nếu muốn default
            }

            hd.setMa("HD" + System.currentTimeMillis());

            // ✅ set kieuHoaDon trước
            hd.setKieuHoaDon(type);

            // ✅ set trạng thái theo loại
            if (type == 0) {
                hd.setTrangThai(TrangThaiHoaDonConstant.CHO_THANH_TOAN);
            } else {
                hd.setTrangThai(TrangThaiHoaDonConstant.CHO_XAC_NHAN);
            }

            hd.setTongTien(BigDecimal.ZERO);
            hd.setTienGiam(BigDecimal.ZERO);
            hd.setDaXoa(false);

            hoaDonRepo.save(hd);

            return converter.toResponse(hd, List.of());
        }


    @Override
    public HoaDonResponse addSanPham(HoaDonChiTietRequest request) {

        HoaDon hd = hoaDonRepo.findById(request.getHoaDonId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        checkHoaDonEditable(hd);

        SanPhamChiTiet spct = spctRepo.findById(request.getChiTietSanPhamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        if (request.getSoLuong() <= 0) {
            throw new RuntimeException("Số lượng phải > 0");
        }

        if (spct.getSoLuong() < request.getSoLuong()) {
            throw new RuntimeException("Không đủ hàng");
        }

        HoaDonChiTiet ct = ctRepo
                .findByHoaDonIdAndChiTietSanPhamId(hd.getId(), spct.getId())
                .orElse(null);

        if (ct != null) {
            int newQty = ct.getSoLuong() + request.getSoLuong();

            if (spct.getSoLuong() < newQty) {
                throw new RuntimeException("Không đủ hàng");
            }

            ct.setSoLuong(newQty);
        } else {
            ct = new HoaDonChiTiet();
            ct.setHoaDon(hd);
            ct.setChiTietSanPham(spct);
            ct.setSoLuong(request.getSoLuong());
            ct.setGia(spct.getGia());
        }

        ctRepo.save(ct);

        return reload(hd);
    }

    @Override
    public HoaDonResponse updateSoLuong(HoaDonChiTietRequest request) {

        HoaDonChiTiet ct = ctRepo
                .findByHoaDonIdAndChiTietSanPhamId(
                        request.getHoaDonId(),
                        request.getChiTietSanPhamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong hóa đơn"));

        HoaDon hd = ct.getHoaDon();
        checkHoaDonEditable(hd);

        if (request.getSoLuong() <= 0) {
            throw new RuntimeException("Số lượng phải > 0");
        }

        SanPhamChiTiet sp = ct.getChiTietSanPham();

        if (sp.getSoLuong() < request.getSoLuong()) {
            throw new RuntimeException("Không đủ hàng");
        }

        ct.setSoLuong(request.getSoLuong());
        ctRepo.save(ct);

        return reload(hd);
    }


    @Override
    public HoaDonResponse removeSanPham(Long id) {

        HoaDonChiTiet ct = ctRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));

        HoaDon hd = ct.getHoaDon();
        checkHoaDonEditable(hd);

        ctRepo.delete(ct);

        return reload(hd);
    }

    @Override
    public HoaDonResponse apDungVoucher(VoucherRequest request) {

        HoaDon hd = hoaDonRepo.findById(request.getHoaDonId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        checkHoaDonEditable(hd);

        Voucher vc = voucherRepo.findByMa(request.getMaVoucher())
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));


        if (vc.getSoLuong() <= 0) {
            throw new RuntimeException("Voucher đã hết");
        }

        BigDecimal tongTien = hd.getTongTien();

        if (tongTien.compareTo(vc.getGiaTriToiThieu()) < 0) {
            throw new RuntimeException("Không đủ điều kiện áp dụng voucher");
        }

        BigDecimal phanTram = vc.getPhanTramGiam()
                .divide(BigDecimal.valueOf(100));

        BigDecimal giam = tongTien.multiply(phanTram);

        if (giam.compareTo(vc.getGiaTriToiDa()) > 0) {
            giam = vc.getGiaTriToiDa();
        }

        hd.setVoucher(vc);
        hd.setTienGiam(giam);

        hoaDonRepo.save(hd);

        return reload(hd);
    }

    private HoaDonResponse reload(HoaDon hd) {

        List<HoaDonChiTiet> list = ctRepo.findByHoaDonId(hd.getId());

        BigDecimal tong = list.stream()
                .map(i -> i.getGia().multiply(BigDecimal.valueOf(i.getSoLuong())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        hd.setTongTien(tong);

        // tính lại giảm nếu có voucher
        if (hd.getVoucher() != null) {
            Voucher vc = hd.getVoucher();

            BigDecimal phanTram = vc.getPhanTramGiam()
                    .divide(BigDecimal.valueOf(100));

            BigDecimal giam = tong.multiply(phanTram);

            if (giam.compareTo(vc.getGiaTriToiDa()) > 0) {
                giam = vc.getGiaTriToiDa();
            }

            hd.setTienGiam(giam);
        }

        hoaDonRepo.save(hd);

        return converter.toResponse(hd, list);
    }

    @Override
    public HoaDon save(HoaDon hoaDon) {
        return hoaDonRepo.save(hoaDon);
    }

    @Override
    public HoaDon findById(Long id) {
        return hoaDonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với id = " + id));
    }

    @Override
    public HoaDonResponse getHoaDonResponse(Long id) {
        HoaDon hoaDon = hoaDonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        List<HoaDonChiTiet> list = ctRepo.findByHoaDonId(id);
        return converter.toResponse(hoaDon, list);
    }

    @Override
    public List<HoaDonResponse> getAllChuaThanhToan() {
        List<HoaDon> list = hoaDonRepo
                .findByTrangThai(TrangThaiHoaDonConstant.CHO_THANH_TOAN);

        return list.stream()
                .map(hd -> {
                    List<HoaDonChiTiet> ctList =
                            ctRepo.findFullByHoaDonId(hd.getId());

                    return converter.toResponse(hd, ctList);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<HoaDonResponse> search(HoaDonSearchRequest request) {

        List<HoaDon> list = hoaDonRepo.search(
                request.getMa(),
                request.getTrangThai(),
                request.getKieuHoaDon(),
                request.getSdt(),
                request.getFromDate(),
                request.getToDate()
        );

        return list.stream()
                .map(converter::toResponse)
                .toList();
    }

    private void checkHoaDonEditable(HoaDon hd) {
        if (!hd.getTrangThai().equals(TrangThaiHoaDonConstant.CHO_THANH_TOAN)) {
            throw new RuntimeException("Hóa đơn không thể chỉnh sửa");
        }
    }

}
