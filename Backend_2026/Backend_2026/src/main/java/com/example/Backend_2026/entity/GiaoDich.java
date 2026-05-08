package com.example.Backend_2026.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "giao_dich")
public class GiaoDich {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK tài khoản
    @Column(name = "tai_khoan_id", nullable = false)
    private Long taiKhoanId;

    // Số tiền giao dịch
    @Column(name = "so_tien", nullable = false)
    private BigDecimal soTien;

    // DEPOSIT / PAYMENT / TRANSFER
    @Column(name = "loai", length = 50)
    private String loai;

    // 0: fail, 1: success
    @Column(name = "trang_thai")
    private Integer trangThai;

    // Ghi chú
    @Column(name = "ghi_chu")
    private String ghiChu;

    // Thời gian tạo
    @Column(name = "tao_luc")
    private LocalDateTime taoLuc;
}