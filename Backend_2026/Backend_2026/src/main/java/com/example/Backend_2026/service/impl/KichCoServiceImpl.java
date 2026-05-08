package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.KichCo;
import com.example.Backend_2026.entity.MauSac;
import com.example.Backend_2026.infrastructure.converter.KichCoConverter;
import com.example.Backend_2026.infrastructure.converter.MauSacConverter;
import com.example.Backend_2026.infrastructure.request.KichCoRequest;
import com.example.Backend_2026.infrastructure.request.MauSacRequest;
import com.example.Backend_2026.infrastructure.response.KichCoResponse;
import com.example.Backend_2026.infrastructure.response.MauSacResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.repository.KichCoRepository;
import com.example.Backend_2026.repository.MauSacRepository;
import com.example.Backend_2026.service.KichCoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KichCoServiceImpl implements KichCoService {
    private final KichCoRepository repository;
    private final KichCoConverter converter;


    @Override
    public KichCoResponse create(KichCoRequest request) {
        if (repository.existsByTen(request.getTen())) {
            throw new RuntimeException("Tên sắc đã tồn tại");
        }

        KichCo entity = converter.toEntity(request);
        entity.setDaXoa(false);

        KichCo saved = repository.save(entity);

        return converter.toResponse(saved);
    }

    @Override
    public KichCoResponse update(Long id, KichCoRequest request) {
        KichCo entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));

        if (repository.existsByTenAndIdNot(request.getTen(), id)) {
            throw new RuntimeException("Tên size sắc đã tồn tại");
        }

        entity.setTen(request.getTen());

        return converter.toResponse(repository.save(entity));
    }

    @Override
    public List<KichCoResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public KichCoResponse getById(Long id) {
        KichCo entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));

        return converter.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        KichCo entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));

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
