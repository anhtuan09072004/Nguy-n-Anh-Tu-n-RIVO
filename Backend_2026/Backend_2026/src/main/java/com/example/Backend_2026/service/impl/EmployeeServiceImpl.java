package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.TaiKhoan;
import com.example.Backend_2026.entity.VaiTro;
import com.example.Backend_2026.infrastructure.converter.EmployeeConverter;
import com.example.Backend_2026.infrastructure.request.CreateEmployeeRequest;
import com.example.Backend_2026.infrastructure.response.EmployeeResponse;
import com.example.Backend_2026.repository.TaiKhoanRepository;
import com.example.Backend_2026.repository.VaiTroRepository;
import com.example.Backend_2026.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final TaiKhoanRepository taiKhoanRepository;
    private final VaiTroRepository vaiTroRepository;
    private final EmployeeConverter converter;

    @Override
    public EmployeeResponse create(CreateEmployeeRequest request) {

        if (taiKhoanRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (request.getVaiTroId() == null) {
            throw new RuntimeException("Chưa chọn chức vụ");
        }

        VaiTro role = vaiTroRepository.findById(request.getVaiTroId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chức vụ"));

        TaiKhoan entity = converter.toEntity(request, role);

        return converter.toResponse(taiKhoanRepository.save(entity));
    }

    @Override
    public List<EmployeeResponse> getAll() {
        return taiKhoanRepository.findAll()
                .stream()
                .filter(t ->
                        t.getVaiTro() != null &&
                                !"CUSTOMER".equalsIgnoreCase(t.getVaiTro().getTen()) &&
                                !t.getDaXoa()
                )
                .map(converter::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        TaiKhoan entity = taiKhoanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));

        entity.setDaXoa(true);
        taiKhoanRepository.save(entity);
    }

    @Override
    public EmployeeResponse update(Long id, CreateEmployeeRequest request) {

        TaiKhoan entity = taiKhoanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        entity.setTen(request.getTen());
        entity.setEmail(request.getEmail());
        entity.setSoDienThoai(request.getSoDienThoai());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setNgaySinh(request.getNgaySinh());

        // chỉ đổi password khi có nhập
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            entity.setPassword(request.getPassword());
        }

        // cập nhật chức vụ
        if (request.getVaiTroId() != null) {
            VaiTro vaiTro = vaiTroRepository.findById(request.getVaiTroId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chức vụ"));

            entity.setVaiTro(vaiTro);
        }

        return converter.toResponse(taiKhoanRepository.save(entity));
    }
}