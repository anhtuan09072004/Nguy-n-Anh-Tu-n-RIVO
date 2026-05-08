package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.CoAo;
import com.example.Backend_2026.entity.SanPham;
import com.example.Backend_2026.infrastructure.response.SanPhamClientListResponse;
import com.example.Backend_2026.infrastructure.response.Top8SanPhamResponse;
import com.example.Backend_2026.infrastructure.response.TopSanPhamResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface SanPhamRepository extends JpaRepository<SanPham, Long> {

    boolean existsByTen(String ten);
    boolean existsByTenAndIdNot(String ten, Long id);

    List<SanPham> findTop8ByDaXoaFalseOrderByTaoLucDesc();


    @Query(value = """
SELECT 
    sp.id,                    -- 1
    sp.ten,                   -- 2
    MIN(ha.ten),              -- 3 ✅ hinhAnh
    MIN(ctsp.gia),            -- 4 ✅ giaMin
    MAX(ctsp.gia),            -- 5 ✅ giaMax
    th.id,                    -- 6
    th.ten,                   -- 7
    xx.id,                    -- 8
    xx.ten                    -- 9

FROM san_pham sp

LEFT JOIN thuong_hieu th 
    ON th.id = sp.thuong_hieu_id

LEFT JOIN xuat_xu xx 
    ON xx.id = sp.xuat_xu_id

LEFT JOIN chi_tiet_san_pham ctsp 
    ON ctsp.san_pham_id = sp.id AND ctsp.da_xoa = 0

LEFT JOIN hinh_anh ha 
    ON ha.san_pham_chi_tiet_id = ctsp.id AND ha.da_xoa = 0

WHERE sp.da_xoa = 0
    AND (:thuongHieuId IS NULL OR th.id = :thuongHieuId)
    AND (:xuatXuId IS NULL OR xx.id = :xuatXuId)
    AND (:keyword IS NULL OR sp.ten LIKE CONCAT('%', :keyword, '%'))

GROUP BY 
    sp.id, sp.ten, sp.tao_luc,
    th.id, th.ten,
    xx.id, xx.ten

ORDER BY sp.tao_luc DESC
""", nativeQuery = true)
    List<SanPhamClientListResponse> filter(
            @Param("keyword") String keyword,
            @Param("thuongHieuId") Long thuongHieuId,
            @Param("xuatXuId") Long xuatXuId
    );

    @Query(value = """
    SELECT TOP 8
        sp.id AS id,
        sp.ten AS ten,
        SUM(hdct.so_luong) AS tongDaBan,
        MIN(ctsp.gia) AS giaMin,
        MAX(ctsp.gia) AS giaMax,
        MIN(ha1.ten) AS hinhAnh
    FROM san_pham sp
    JOIN chi_tiet_san_pham ctsp 
        ON sp.id = ctsp.san_pham_id

    OUTER APPLY (
        SELECT TOP 1 ha.ten
        FROM hinh_anh ha
        WHERE ha.san_pham_chi_tiet_id = ctsp.id
        ORDER BY ha.id ASC
    ) ha1

    JOIN hoa_don_chi_tiet hdct 
        ON hdct.chi_tiet_san_pham_id = ctsp.id
    JOIN hoa_don hd 
        ON hd.id = hdct.hoa_don_id
    WHERE 
        hd.trang_thai = 5
        AND sp.da_xoa = 0
        AND ctsp.da_xoa = 0
        AND (hdct.da_xoa = 0 OR hdct.da_xoa IS NULL)
    GROUP BY 
        sp.id, sp.ten
    ORDER BY 
        SUM(hdct.so_luong) DESC
""", nativeQuery = true)
    List<Object[]> getTop8Raw();
}

