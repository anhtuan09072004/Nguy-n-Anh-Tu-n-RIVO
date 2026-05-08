package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Long> {
    Optional<HoaDonChiTiet> findByHoaDonIdAndChiTietSanPhamId(Long hoaDonId, Long spctId);

    List<HoaDonChiTiet> findByHoaDonId(Long hoaDonId);

    void deleteByHoaDonId(Long hoaDonId);

    @Query("""
        SELECT ct FROM HoaDonChiTiet ct
        JOIN FETCH ct.chiTietSanPham sp
        LEFT JOIN FETCH sp.hinhAnh
        LEFT JOIN FETCH sp.mauSac
        LEFT JOIN FETCH sp.kichCo
        LEFT JOIN FETCH sp.sanPham
        WHERE ct.hoaDon.id = :hoaDonId
        """)
    List<HoaDonChiTiet> findFullByHoaDonId(Long hoaDonId);




}
