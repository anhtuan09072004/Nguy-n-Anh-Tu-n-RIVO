package com.example.Backend_2026.infrastructure.converter;

import com.example.Backend_2026.entity.TaiKhoan;
import com.example.Backend_2026.entity.VaiTro;
import com.example.Backend_2026.infrastructure.request.CreateEmployeeRequest;
import com.example.Backend_2026.infrastructure.response.EmployeeResponse;
import org.springframework.stereotype.Component;

@Component
public class EmployeeConverter {
    public TaiKhoan toEntity(CreateEmployeeRequest request, VaiTro role) {
        TaiKhoan tk = new TaiKhoan();
        tk.setTen(request.getTen());
        tk.setUsername(request.getUsername());
        tk.setPassword(request.getPassword());
        tk.setEmail(request.getEmail());
        tk.setSoDienThoai(request.getSoDienThoai());
        tk.setGioiTinh(request.getGioiTinh());
        tk.setNgaySinh(request.getNgaySinh());
        tk.setVaiTro(role);
        tk.setDaXoa(false);
        return tk;
    }

    public EmployeeResponse toResponse(TaiKhoan entity) {
        return EmployeeResponse.builder()
                .id(entity.getId())
                .ten(entity.getTen())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .soDienThoai(entity.getSoDienThoai())
                .gioiTinh(entity.getGioiTinh())
                .ngaySinh(entity.getNgaySinh())
                .vaiTro(entity.getVaiTro() != null ? entity.getVaiTro().getTen() : null)
                .build();
    }
}
