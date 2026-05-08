package com.example.Backend_2026.infrastructure.converter;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.entity.HoaDonChiTiet;
import com.example.Backend_2026.infrastructure.response.HoaDonChiTietResponse;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class HoaDonConverter {
    public HoaDonResponse toResponse(HoaDon hoaDon, List<HoaDonChiTiet> list) {
        HoaDonResponse res = new HoaDonResponse();
        res.setId(hoaDon.getId());
        res.setTongTien(hoaDon.getTongTien());
        res.setTienGiam(hoaDon.getTienGiam());
        res.setTienShip(hoaDon.getTienShip());
        res.setTrangThai(hoaDon.getTrangThai());
        res.setTaoLuc(hoaDon.getTaoLuc());

        List<HoaDonChiTietResponse> ct = list.stream().map(item -> {
            HoaDonChiTietResponse r = new HoaDonChiTietResponse();
            r.setId(item.getId());
            r.setSoLuong(item.getSoLuong());
            r.setGia(item.getGia());
            r.setThanhTien(item.getGia().multiply(BigDecimal.valueOf(item.getSoLuong())));
            r.setSoLuongTon(
                    item.getChiTietSanPham().getSoLuong() != null
                            ? item.getChiTietSanPham().getSoLuong()
                            : 0
            );
            r.setTenSanPham(item.getChiTietSanPham().getSanPham().getTen());
            r.setMauSac(item.getChiTietSanPham().getMauSac().getTen());
            r.setKichCo(item.getChiTietSanPham().getKichCo().getTen());
            r.setChiTietSanPhamId(item.getChiTietSanPham().getId());
            r.setHoaDonId(item.getHoaDon().getId());

            if (!item.getChiTietSanPham().getHinhAnh().isEmpty()) {

                String fileName = item.getChiTietSanPham()
                        .getHinhAnh()
                        .get(0)
                        .getTen();

                if (fileName.startsWith("http")) {
                    r.setHinhAnh(fileName);
                } else {
                    r.setHinhAnh("http://localhost:8080/uploads/" + fileName);
                }
            }
            return r;
        }).toList();

        res.setHoaDonChiTiets(ct);
        return res;
    }


    public HoaDonResponse toResponse(HoaDon hoaDon) {
        HoaDonResponse res = new HoaDonResponse();
        res.setId(hoaDon.getId());
        res.setTongTien(hoaDon.getTongTien());
        res.setTienGiam(hoaDon.getTienGiam());
        res.setTienShip(hoaDon.getTienShip());
        res.setTrangThai(hoaDon.getTrangThai());
        res.setTenKhachHang(hoaDon.getTenKhachHang());
        res.setSdt(hoaDon.getPhoneNumber());
        res.setKieuHoaDon(hoaDon.getKieuHoaDon());
        res.setTaoLuc(hoaDon.getTaoLuc());
        return res;
    }


}
