package com.example.Backend_2026.infrastructure.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {

    @NotBlank(message = "Tên không được để trống")
    private String ten;

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;

    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^(0[0-9]{9})$", message = "SĐT không hợp lệ")
    private String soDienThoai;

    private String gioiTinh;

    @Past(message = "Ngày sinh phải trong quá khứ")
    private LocalDate ngaySinh;

    @NotNull(message = "Chức vụ không được để trống")
    private Long vaiTroId;
}