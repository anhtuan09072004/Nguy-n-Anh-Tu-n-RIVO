package com.example.Backend_2026.service;

import com.example.Backend_2026.infrastructure.request.KichCoRequest;
import com.example.Backend_2026.infrastructure.response.KichCoResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;

import java.util.List;

public interface KichCoService {
    KichCoResponse create(KichCoRequest request);
    KichCoResponse update(Long id , KichCoRequest request);
    List<KichCoResponse> getAll();
    KichCoResponse getById(Long id);
    void delete(Long id);
    List<SimpleResponse> getAllClient();
}
