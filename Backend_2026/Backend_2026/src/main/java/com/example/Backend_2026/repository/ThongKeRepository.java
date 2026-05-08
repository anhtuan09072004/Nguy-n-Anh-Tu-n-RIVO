package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.infrastructure.response.TonKhoResponse;
import com.example.Backend_2026.infrastructure.response.TopSanPhamResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ThongKeRepository extends JpaRepository<HoaDon, Long> {
    // ================= DOANH THU =================
    @Query("""
         SELECT COALESCE(SUM(h.tongTien - h.tienShip), 0)
        FROM HoaDon h
        WHERE h.trangThai = 5
        AND h.ngayThanhToan BETWEEN :start AND :end
    """)
    BigDecimal getDoanhThu(LocalDateTime start, LocalDateTime end);

    // ================= SỐ ĐƠN =================
    @Query("""
        SELECT COUNT(h)
        FROM HoaDon h
        WHERE h.trangThai = 5
        AND h.ngayThanhToan BETWEEN :start AND :end
    """)
    Long countDon(LocalDateTime start, LocalDateTime end);

    // ================= TOP 5 BÁN CHẠY =================
    @Query("""
        SELECT new com.example.Backend_2026.infrastructure.response.TopSanPhamResponse(
            ctsp.id,
            sp.ten,
            kc.ten,
            ms.ten,
            MIN(ha.ten),
            SUM(ct.soLuong)
        )
        FROM HoaDonChiTiet ct
        JOIN ct.chiTietSanPham ctsp
        JOIN ctsp.sanPham sp
        JOIN ctsp.kichCo kc
        JOIN ctsp.mauSac ms
        LEFT JOIN HinhAnh ha ON ha.sanPhamChiTiet.id = ctsp.id
        WHERE ct.hoaDon.trangThai = 5
        GROUP BY ctsp.id, sp.ten, kc.ten, ms.ten
        ORDER BY SUM(ct.soLuong) DESC
        """)
    List<TopSanPhamResponse> topBanChay(org.springframework.data.domain.Pageable pageable);

    @Query("""
        SELECT new com.example.Backend_2026.infrastructure.response.TonKhoResponse(
            sp.id,
            sp.sanPham.ten,
            kc.ten,
            ms.ten,
            MIN(ha.ten),
            sp.soLuong
        )
        FROM SanPhamChiTiet sp
        JOIN sp.kichCo kc
        JOIN sp.mauSac ms
        LEFT JOIN HinhAnh ha ON ha.sanPhamChiTiet.id = sp.id
        WHERE sp.daXoa = false
        AND sp.soLuong <= 10
        GROUP BY sp.id, sp.sanPham.ten, kc.ten, ms.ten, sp.soLuong
        ORDER BY sp.soLuong ASC
        """)
    List<TonKhoResponse> topSapHet(Pageable pageable);
}
