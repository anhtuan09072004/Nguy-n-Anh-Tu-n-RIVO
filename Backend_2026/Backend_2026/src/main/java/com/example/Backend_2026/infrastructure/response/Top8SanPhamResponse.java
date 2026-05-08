package com.example.Backend_2026.infrastructure.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Top8SanPhamResponse {
    private Long id;
    private String ten;
    private Long tongDaBan;
    private BigDecimal giaMin;   // ✅ sửa lại
    private BigDecimal giaMax;   // ✅ sửa lại
    private String hinhAnh;

}
