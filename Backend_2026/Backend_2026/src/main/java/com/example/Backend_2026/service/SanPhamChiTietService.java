package com.example.Backend_2026.service;

import com.example.Backend_2026.entity.SanPhamChiTiet;
import com.example.Backend_2026.infrastructure.request.SanPhamChiTietRequest;
import com.example.Backend_2026.infrastructure.request.SanPhamRequest;
import com.example.Backend_2026.infrastructure.response.SanPhamChiTietResponse;
import com.example.Backend_2026.infrastructure.response.SanPhamResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SanPhamChiTietService {

    SanPhamChiTietResponse create(
            SanPhamChiTietRequest request,
            List<MultipartFile> files
    );

    SanPhamChiTietResponse update(
            Long id,
            SanPhamChiTietRequest request,
            List<MultipartFile> files
    );

    SanPhamChiTietResponse getById(Long id);

    List<SanPhamChiTietResponse> getAll();

    void delete(Long id);

    List<SanPhamChiTietResponse> getBySanPhamId(Long sanPhamId);

    List<SanPhamChiTietResponse> search(String keyword);

    SanPhamChiTiet save(SanPhamChiTiet ctsp);

}
