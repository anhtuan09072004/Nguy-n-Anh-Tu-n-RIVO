package com.example.Backend_2026.infrastructure.converter;

import com.example.Backend_2026.entity.GioHangChiTiet;
import com.example.Backend_2026.infrastructure.response.GioHangChiTietResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class GioHangConverter {

    public GioHangChiTietResponse toResponse(GioHangChiTiet ghct) {

        var ctsp = ghct.getSanPhamChiTiet();
        var sp = ctsp.getSanPham();

        BigDecimal gia = ctsp.getGia();

        return GioHangChiTietResponse.builder()
                .id(ghct.getId())
                .chiTietSanPhamId(ctsp.getId())
                .soLuong(ghct.getSoLuong())
                .tonKho(ctsp.getSoLuong())

                .sanPhamId(sp.getId())
                .tenSanPham(sp.getTen())

                .mauSac(ctsp.getMauSac().getTen())
                .kichCo(ctsp.getKichCo().getTen())

                .gia(gia)
                .tongTien(gia.multiply(BigDecimal.valueOf(ghct.getSoLuong())))

                .hinhAnh(
                        ctsp.getHinhAnh().isEmpty()
                                ? null
                                : ctsp.getHinhAnh().get(0).getTen()
                )
                .build();
    }
}
