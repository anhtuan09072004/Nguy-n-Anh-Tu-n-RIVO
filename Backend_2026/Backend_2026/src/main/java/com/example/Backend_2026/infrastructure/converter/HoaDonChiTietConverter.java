package com.example.Backend_2026.infrastructure.converter;

import com.example.Backend_2026.entity.HoaDonChiTiet;
import com.example.Backend_2026.infrastructure.response.HoaDonChiTietResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class HoaDonChiTietConverter {
    public HoaDonChiTietResponse toResponse(HoaDonChiTiet entity) {
        HoaDonChiTietResponse res = new HoaDonChiTietResponse();

        res.setId(entity.getId());
        res.setHoaDonId(entity.getHoaDon().getId());
        res.setChiTietSanPhamId(entity.getChiTietSanPham().getId());
        res.setSoLuong(entity.getSoLuong());
        res.setSoLuongTon(entity.getChiTietSanPham().getSoLuong());
        res.setGia(entity.getGia());
        res.setThanhTien(
                entity.getGia().multiply(BigDecimal.valueOf(entity.getSoLuong()))
        );

        // 👉 TÊN
        res.setTenSanPham(
                entity.getChiTietSanPham()
                        .getSanPham()
                        .getTen()
        );

        // 👉 MÀU
        res.setMauSac(
                entity.getChiTietSanPham()
                        .getMauSac()
                        .getTen()
        );

        // 👉 SIZE
        res.setKichCo(
                entity.getChiTietSanPham()
                        .getKichCo()
                        .getTen()
        );

        // 👉 ẢNH (QUAN TRỌNG NHẤT)
        if (entity.getChiTietSanPham().getHinhAnh() != null
                && !entity.getChiTietSanPham().getHinhAnh().isEmpty()) {

            String fileName = entity.getChiTietSanPham()
                    .getHinhAnh()
                    .get(0)
                    .getTen();

//            res.setHinhAnh("http://localhost:8080/uploads/" + fileName);
            if (fileName.startsWith("http")) {
                res.setHinhAnh(fileName);
            } else {
                res.setHinhAnh("TEST_URL" + fileName);
            }
        }

        return res;
    }
}
