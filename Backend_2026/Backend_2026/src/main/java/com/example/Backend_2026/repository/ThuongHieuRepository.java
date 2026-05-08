package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.ChatLieu;
import com.example.Backend_2026.entity.MauSac;
import com.example.Backend_2026.entity.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface ThuongHieuRepository extends JpaRepository<ThuongHieu,Long> {
    boolean existsByTen(String ten);
    boolean existsByTenAndIdNot(String ten, Long id);
    List<ThuongHieu> findByDaXoaFalse();
}
