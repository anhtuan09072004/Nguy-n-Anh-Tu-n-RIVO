package com.example.Backend_2026.service.Login;

import com.example.Backend_2026.entity.TaiKhoan;
import com.example.Backend_2026.infrastructure.request.LoginRequest;
import com.example.Backend_2026.infrastructure.response.LoginResponse;
import com.example.Backend_2026.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final TaiKhoanRepository taiKhoanRepository;

    public LoginResponse login(LoginRequest request) {
        TaiKhoan taiKhoan = taiKhoanRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai tài khoản hoặc mật khẩu"));

        if (!taiKhoan.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu");
        }

        return new LoginResponse(
                taiKhoan.getId(),
                taiKhoan.getTen(),
                taiKhoan.getUsername(),
                taiKhoan.getVaiTro().getTen()
        );
    }
}
