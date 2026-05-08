package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.SanPham;
import com.example.Backend_2026.entity.SanPhamChiTiet;
import com.example.Backend_2026.infrastructure.response.SanPhamChiTietResponse;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Long> {

    List<SanPhamChiTiet> findBySanPhamIdAndDaXoaFalse(Long sanPhamId);

    boolean existsBySanPhamIdAndKichCoIdAndMauSacIdAndDaXoaFalse(
            Long sanPhamId, Long kichCoId, Long mauSacId
    );

    boolean existsByMaAndDaXoaFalse(String ma);


    // UPDATE (loại trừ chính nó)
    boolean existsBySanPhamIdAndKichCoIdAndMauSacIdAndIdNotAndDaXoaFalse(
            Long sanPhamId, Long kichCoId, Long mauSacId, Long id
    );

    boolean existsByMaAndIdNotAndDaXoaFalse(String ma, Long id);

    @Query("""
        SELECT c FROM SanPhamChiTiet c
        JOIN c.sanPham sp
        LEFT JOIN FETCH c.hinhAnh ha
        WHERE c.daXoa = false
        AND (
            LOWER(sp.ten) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(sp.ma) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    List<SanPhamChiTiet> search(@Param("keyword") String keyword);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select sp from SanPhamChiTiet sp where sp.id = :id")
    SanPhamChiTiet findByIdForUpdate(Long id);

}
