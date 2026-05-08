package com.example.Backend_2026.infrastructure.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TonKhoResponse {
    private Long sanPhamChiTietId;
    private String tenSanPham;
    private String size;     // ✅ thêm
    private String mauSac;   // ✅ thêm
    private String anh;

    private Integer soLuongTon;
}
