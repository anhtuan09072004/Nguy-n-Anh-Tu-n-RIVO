package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.entity.HoaDonChiTiet;
import com.example.Backend_2026.entity.SanPhamChiTiet;
import com.example.Backend_2026.infrastructure.response.OrderDetailResponse;
import com.example.Backend_2026.repository.HoaDonChiTietRepository;
import com.example.Backend_2026.repository.HoaDonRepository;
import com.example.Backend_2026.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository ctRepo;

    // list
    @Override
    public List<OrderDetailResponse> getOrdersByUser(Long userId) {

        List<HoaDon> list = hoaDonRepo.findByKhachHangIdAndKieuHoaDonOrderByTaoLucDesc(userId, 1);

        return list.stream().map(hd -> OrderDetailResponse.builder()
                .id(hd.getId())
                .ma(hd.getMa())
                .tongTien(hd.getTongTien())
                .tienGiam(hd.getTienGiam())
                .tienShip(hd.getTienShip())
                .trangThai(hd.getTrangThai())
                .tenKhachHang(hd.getTenKhachHang())
                .sdt(hd.getPhoneNumber())
                .email(hd.getEmail())
                .diaChi(hd.getDiaChi())
                .build()
        ).collect(Collectors.toList());
    }

    // deital
    @Override
    public OrderDetailResponse getOrderDetail(Long orderId) {

        HoaDon hd = hoaDonRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn"));

        List<HoaDonChiTiet> list = ctRepo.findByHoaDonId(orderId);

        return OrderDetailResponse.builder()
                .id(hd.getId())
                .ma(hd.getMa())
                .tongTien(hd.getTongTien())
                .tienGiam(hd.getTienGiam())
                .tienShip(hd.getTienShip())
                .trangThai(hd.getTrangThai())
                .tenKhachHang(hd.getTenKhachHang())
                .sdt(hd.getPhoneNumber())
                .email(hd.getEmail())
                .diaChi(hd.getDiaChi())

                .items(list.stream().map(ct -> mapItem(ct)).collect(Collectors.toList()))

                .build();
    }

    // MAP ITEM
    private OrderDetailResponse.Item mapItem(HoaDonChiTiet ct) {

        SanPhamChiTiet sp = ct.getChiTietSanPham();

        return OrderDetailResponse.Item.builder()
                .tenSanPham(sp.getSanPham().getTen())
                .mauSac(sp.getMauSac().getTen())
                .kichCo(sp.getKichCo().getTen())
                .soLuong(ct.getSoLuong())
                .gia(ct.getGia())
                .build();
    }
}