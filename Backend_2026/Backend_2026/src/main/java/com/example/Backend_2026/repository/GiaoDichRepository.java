package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.GiaoDich;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiaoDichRepository extends JpaRepository<GiaoDich, Long> {

    List<GiaoDich> findByTaiKhoanIdOrderByTaoLucDesc(Long taiKhoanId);


}
