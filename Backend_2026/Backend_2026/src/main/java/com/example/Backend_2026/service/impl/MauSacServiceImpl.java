package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.MauSac;
import com.example.Backend_2026.infrastructure.converter.MauSacConverter;
import com.example.Backend_2026.infrastructure.request.MauSacRequest;
import com.example.Backend_2026.infrastructure.response.MauSacResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.repository.MauSacRepository;
import com.example.Backend_2026.service.MauSacService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MauSacServiceImpl implements MauSacService {
    private final MauSacRepository repository;
    private final MauSacConverter converter;

    @Override
    public MauSacResponse create(MauSacRequest request) {

        if (repository.existsByTen(request.getTen())) {
            throw new RuntimeException("Tên màu sắc đã tồn tại");
        }

        MauSac entity = converter.toEntity(request);
        entity.setDaXoa(false);

        MauSac saved = repository.save(entity);

        return converter.toResponse(saved);
    }

    @Override
    public MauSacResponse update(Long id, MauSacRequest request) {

        MauSac entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc"));

        if (repository.existsByTenAndIdNot(request.getTen(), id)) {
            throw new RuntimeException("Tên màu sắc đã tồn tại");
        }

        entity.setTen(request.getTen());

        return converter.toResponse(repository.save(entity));
    }

    @Override
    public List<MauSacResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public MauSacResponse getById(Long id) {
        MauSac entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc"));

        return converter.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        MauSac entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc"));

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
