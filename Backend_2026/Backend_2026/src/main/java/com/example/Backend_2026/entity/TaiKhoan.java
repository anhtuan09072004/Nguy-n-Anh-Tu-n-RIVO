package com.example.Backend_2026.entity;

import com.example.Backend_2026.entity.Base.PrimaryEnity;
import com.example.Backend_2026.infrastructure.constant.AccountRoles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "tai_khoan")
public class TaiKhoan extends PrimaryEnity {
    @ManyToOne
    @JoinColumn(name = "vai_tro_id")
    @JsonIgnoreProperties(value = {"tao_luc", "cap_nhat_luc", "tao_boi", "cap_nhat_boi", "da_xoa"})
    private VaiTro vaiTro;

    @Nationalized
    @Column(name = "ten")
    private String ten;

    @Column(name = "username")
    private String username;

    @Nationalized
    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "cccd")
    private String cccd;


    @Nationalized
    @Column(name = "avatar")
    private String avatar;

    @Nationalized
    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "ngay_sinh")
    @Temporal(TemporalType.DATE)
    private LocalDate ngaySinh;

    @Column(name = "so_du")
    private BigDecimal soDu;

    @JsonIgnoreProperties(value = {"sanPhamChiTiet", "tao_luc", "cap_nhat_luc", "tao_boi", "cap_nhat_boi", "da_xoa"})
    @OneToMany(mappedBy = "taiKhoan", fetch = FetchType.EAGER)
    List<DiaChi> diaChi;


}
