package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {
    List<HoaDon> findByTrangThai(Integer trangThai);


    @Query("""
        SELECT hd FROM HoaDon hd
        WHERE (:ma IS NULL OR hd.ma LIKE %:ma%)
        AND (:trangThai IS NULL OR hd.trangThai = :trangThai)
        AND (:kieuHoaDon IS NULL OR hd.kieuHoaDon = :kieuHoaDon)
        AND (:sdt IS NULL OR CAST(hd.phoneNumber AS string) LIKE %:sdt%)
        AND (:fromDate IS NULL OR hd.taoLuc >= :fromDate)
        AND (:toDate IS NULL OR hd.taoLuc <= :toDate)
        AND hd.daXoa = false
        ORDER BY hd.taoLuc DESC
    """)
    List<HoaDon> search(
            @Param("ma") String ma,
            @Param("trangThai") Integer trangThai,
            @Param("kieuHoaDon") Integer kieuHoaDon,
            @Param("sdt") String sdt,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );


    // lấy đơn đặt hàng theo id
    List<HoaDon> findByKhachHangIdAndKieuHoaDonOrderByTaoLucDesc(Long userId, Integer kieuHoaDon);

}
