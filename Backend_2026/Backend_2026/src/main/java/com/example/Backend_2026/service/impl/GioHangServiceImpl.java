package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.GioHang;
import com.example.Backend_2026.entity.GioHangChiTiet;
import com.example.Backend_2026.entity.SanPhamChiTiet;
import com.example.Backend_2026.entity.TaiKhoan;
import com.example.Backend_2026.infrastructure.converter.GioHangConverter;
import com.example.Backend_2026.infrastructure.request.AddToCartRequest;
import com.example.Backend_2026.infrastructure.response.CartResponse;
import com.example.Backend_2026.infrastructure.response.GioHangChiTietResponse;
import com.example.Backend_2026.repository.GioHangChiTietRepository;
import com.example.Backend_2026.repository.GioHangRepository;
import com.example.Backend_2026.repository.SanPhamChiTietRepository;
import com.example.Backend_2026.repository.TaiKhoanRepository;
import com.example.Backend_2026.service.GioHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GioHangServiceImpl implements GioHangService {

    private final GioHangRepository gioHangRepository;
    private final GioHangChiTietRepository gioHangChiTietRepository;
    private final SanPhamChiTietRepository chiTietSanPhamRepository;
    private final GioHangConverter converter;


    @Override
    public void addToCart(AddToCartRequest request) {

        // 1. lấy hoặc tạo giỏ hàng
        GioHang gioHang = gioHangRepository
                .findByTaiKhoanId(request.getTaiKhoanId())
                .orElseGet(() -> {
                    GioHang gh = new GioHang();
                    TaiKhoan tk = new TaiKhoan();
                    tk.setId(request.getTaiKhoanId());

                    gh.setTaiKhoan(tk);
                    return gioHangRepository.save(gh);
                });

        // 2. lấy sản phẩm
        SanPhamChiTiet ctsp = chiTietSanPhamRepository
                .findById(request.getChiTietSanPhamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // 3. check đã tồn tại chưa
        GioHangChiTiet ghct = gioHangChiTietRepository
                .findByGioHangIdAndSanPhamChiTietId(gioHang.getId(), ctsp.getId())
                .orElse(null);

        int soLuongMoi = request.getSoLuong();

        if (ghct != null) {
            soLuongMoi = ghct.getSoLuong() + request.getSoLuong();
        }

        if (soLuongMoi > ctsp.getSoLuong()) {
            throw new RuntimeException("Sản phẩm không đủ số lượng");
        }

        if (ghct != null) {
            ghct.setSoLuong(soLuongMoi);
        } else {
            ghct = new GioHangChiTiet();
            ghct.setGioHang(gioHang);
            ghct.setSanPhamChiTiet(ctsp);
            ghct.setSoLuong(request.getSoLuong());
        }

        gioHangChiTietRepository.save(ghct);
    }

    @Override
    public CartResponse getCart(Long taiKhoanId) {

//        GioHang gioHang = gioHangRepository
//                .findByTaiKhoanId(taiKhoanId)
//                .orElseThrow(() -> new RuntimeException("Chưa có giỏ hàng"));
//
//        List<GioHangChiTietResponse> items = gioHangChiTietRepository
//                .findByGioHangId(gioHang.getId())
//                .stream()
//                .map(converter::toResponse)
//                .toList();
//
//        // tính tổng tiền ở đây
//        BigDecimal total = items.stream()
//                .map(GioHangChiTietResponse::getTongTien)
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//
//        return new CartResponse(items, total);
        GioHang gioHang = gioHangRepository
                .findByTaiKhoanId(taiKhoanId)
                .orElseGet(() -> {
                    GioHang gh = new GioHang();
                    TaiKhoan tk = new TaiKhoan();
                    tk.setId(taiKhoanId);
                    gh.setTaiKhoan(tk);
                    return gioHangRepository.save(gh);
                });

        List<GioHangChiTietResponse> items = gioHangChiTietRepository
                .findByGioHangId(gioHang.getId())
                .stream()
                .map(converter::toResponse)
                .toList();

        BigDecimal total = items.stream()
                .map(GioHangChiTietResponse::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, total);

    }

    @Override
    public void updateQuantity(Long ghctId, Integer soLuong) {
        GioHangChiTiet ghct = gioHangChiTietRepository
                .findById(ghctId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        //  nếu <= 0 thì xoá luôn
        if (soLuong <= 0) {
            gioHangChiTietRepository.delete(ghct);
            return;
        }

        ghct.setSoLuong(soLuong);
        gioHangChiTietRepository.save(ghct);
    }

    @Override
    public void deleteItem(Long ghctId) {
        gioHangChiTietRepository.deleteById(ghctId);
    }
}
