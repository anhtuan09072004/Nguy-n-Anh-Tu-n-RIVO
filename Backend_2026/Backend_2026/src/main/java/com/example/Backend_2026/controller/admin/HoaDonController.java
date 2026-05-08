package com.example.Backend_2026.controller.admin;

import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.infrastructure.request.*;
import com.example.Backend_2026.infrastructure.response.HoaDonResponse;
import com.example.Backend_2026.service.HoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ban-hang")
@RequiredArgsConstructor
public class HoaDonController {
    private final HoaDonService service;

    @PostMapping("/hoa-don")
    public HoaDonResponse create(@RequestBody HoaDonRequest request) {
        return service.createHoaDon(request);
    }

    @PostMapping("/them-san-pham")
    public HoaDonResponse add(@RequestBody HoaDonChiTietRequest request) {
        return service.addSanPham(request);
    }

    @PutMapping("/update-so-luong")
    public HoaDonResponse update(@RequestBody HoaDonChiTietRequest request) {
        return service.updateSoLuong(request);
    }

    @DeleteMapping("/xoa/{id}")
    public void delete(@PathVariable Long id) {
        service.removeSanPham(id);
    }

    @PostMapping("/voucher")
    public HoaDonResponse voucher(@RequestBody VoucherRequest request) {
        return service.apDungVoucher(request);
    }

//    @PostMapping("/thanh-toan")
//    public void thanhToan(@RequestBody ThanhToanRequest request) {
//        service.thanhToan(request);
//    }

    @GetMapping("/{id}")
    public HoaDonResponse  getById(@PathVariable Long id) {
        return service.getHoaDonResponse(id);
    }

    @GetMapping("/hoa-don")
    public List<HoaDonResponse> getAll() {
        return service.getAllChuaThanhToan();
    }

    @PostMapping("/search")
    public List<HoaDonResponse> search(@RequestBody HoaDonSearchRequest request) {
        return service.search(request);
    }
}
