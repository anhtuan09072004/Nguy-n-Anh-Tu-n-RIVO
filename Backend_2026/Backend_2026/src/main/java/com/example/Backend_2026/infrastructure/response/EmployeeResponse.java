package com.example.Backend_2026.infrastructure.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
public class EmployeeResponse {
    private Long id;
    private String ten;
    private String username;
    private String email;
    private String soDienThoai;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String vaiTro;
}
