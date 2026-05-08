package com.example.Backend_2026.service;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.infrastructure.request.*;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HoaDonService {
    HoaDonResponse createHoaDon(HoaDonRequest request);

    HoaDonResponse addSanPham(HoaDonChiTietRequest request);

    HoaDonResponse updateSoLuong(HoaDonChiTietRequest request);

    HoaDonResponse removeSanPham(Long id);

    HoaDonResponse apDungVoucher(VoucherRequest request);

    HoaDon save(HoaDon hoaDon);

    HoaDon findById(Long id);

    HoaDonResponse getHoaDonResponse(Long id);

    //
    List<HoaDonResponse> getAllChuaThanhToan();

    List<HoaDonResponse> search(HoaDonSearchRequest request);



}
