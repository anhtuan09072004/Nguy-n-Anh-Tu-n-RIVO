package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface MauSacRepository extends JpaRepository<MauSac, Long> {
    boolean existsByTen(String ten);
    boolean existsByTenAndIdNot(String ten, Long id);
    List<MauSac> findByDaXoaFalse();
}
