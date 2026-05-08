package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.ThuongHieu;
import com.example.Backend_2026.entity.XuatXu;
import com.example.Backend_2026.infrastructure.converter.ThuongHieuConverter;
import com.example.Backend_2026.infrastructure.converter.XuatXuConverter;
import com.example.Backend_2026.infrastructure.request.ThuongHieuRequest;
import com.example.Backend_2026.infrastructure.request.XuatXuRequest;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.infrastructure.response.ThuongHieuResponse;
import com.example.Backend_2026.infrastructure.response.XuatXuResponse;
import com.example.Backend_2026.repository.ThuongHieuRepository;
import com.example.Backend_2026.repository.XuatXuRepository;
import com.example.Backend_2026.service.ThuongHieuService;
import com.example.Backend_2026.service.XuatXuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class XuatXuServiceImpl implements XuatXuService {
    private final XuatXuRepository repository;
    private final XuatXuConverter converter;


    @Override
    public XuatXuResponse create(XuatXuRequest request) {
        if (repository.existsByTen(request.getTen())) {
            throw new RuntimeException("Tên thuong hieu đã tồn tại");
        }

        XuatXu entity = converter.toEntity(request);
        entity.setDaXoa(false);

        XuatXu saved = repository.save(entity);

        return converter.toResponse(saved);
    }

    @Override
    public XuatXuResponse update(Long id, XuatXuRequest request) {
        XuatXu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xuat xu"));

        if (repository.existsByTenAndIdNot(request.getTen(), id)) {
            throw new RuntimeException("Tên xuat xu sắc đã tồn tại");
        }

        entity.setTen(request.getTen());

        return converter.toResponse(repository.save(entity));
    }

    @Override
    public List<XuatXuResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public XuatXuResponse getById(Long id) {
        XuatXu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xuat xu"));

        return converter.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        XuatXu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xuat xu"));
        entity.setDaXoa(true);
        repository.save(entity);
    }

    @Override
    public List<SimpleResponse> getAllClient() {
        return repository.findByDaXoaFalse()
                .stream()
                .map(m -> new SimpleResponse(m.getId(), m.getTen()))
                .toList();
    }
}
