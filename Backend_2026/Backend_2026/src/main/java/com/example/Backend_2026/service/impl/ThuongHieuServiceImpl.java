package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.ChatLieu;
import com.example.Backend_2026.entity.ThuongHieu;
import com.example.Backend_2026.infrastructure.converter.ChatLieuConverter;
import com.example.Backend_2026.infrastructure.converter.ThuongHieuConverter;
import com.example.Backend_2026.infrastructure.request.ChatLieuRequest;
import com.example.Backend_2026.infrastructure.request.ThuongHieuRequest;
import com.example.Backend_2026.infrastructure.response.ChatLieuResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.infrastructure.response.ThuongHieuResponse;
import com.example.Backend_2026.repository.ChatLieuRepository;
import com.example.Backend_2026.repository.ThuongHieuRepository;
import com.example.Backend_2026.service.ChatLieuService;
import com.example.Backend_2026.service.ThuongHieuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThuongHieuServiceImpl implements ThuongHieuService {
    private final ThuongHieuRepository repository;
    private final ThuongHieuConverter converter;


    @Override
    public ThuongHieuResponse create(ThuongHieuRequest request) {
        if (repository.existsByTen(request.getTen())) {
            throw new RuntimeException("Tên thuong hieu đã tồn tại");
        }

        ThuongHieu entity = converter.toEntity(request);
        entity.setDaXoa(false);

        ThuongHieu saved = repository.save(entity);

        return converter.toResponse(saved);
    }

    @Override
    public ThuongHieuResponse update(Long id, ThuongHieuRequest request) {
        ThuongHieu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuong hieu"));

        if (repository.existsByTenAndIdNot(request.getTen(), id)) {
            throw new RuntimeException("Tên thuong hieu sắc đã tồn tại");
        }

        entity.setTen(request.getTen());

        return converter.toResponse(repository.save(entity));
    }

    @Override
    public List<ThuongHieuResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public ThuongHieuResponse getById(Long id) {
        ThuongHieu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuong hieu"));

        return converter.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        ThuongHieu entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuowng hieu"));

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
