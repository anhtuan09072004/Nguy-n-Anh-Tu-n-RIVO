package com.example.Backend_2026.infrastructure.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class QuanLyHoaDonRequest {
    private String ma;
    private Integer trangThai;
    private Integer kieuHoaDon;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime tuNgay;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime denNgay;

    private String tenKhachHang;
    private String sdt;

    private Integer page = 0;
    private Integer size = 10;
    private String sortType; // default | newest
}
