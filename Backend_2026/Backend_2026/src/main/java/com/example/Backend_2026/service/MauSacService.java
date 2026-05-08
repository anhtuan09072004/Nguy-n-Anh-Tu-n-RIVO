package com.example.Backend_2026.service;

import com.example.Backend_2026.entity.MauSac;
import com.example.Backend_2026.infrastructure.request.MauSacRequest;
import com.example.Backend_2026.infrastructure.response.MauSacResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;

import java.util.List;

public interface MauSacService {
    MauSacResponse create(MauSacRequest request);

    MauSacResponse update(Long id, MauSacRequest request);

    List<MauSacResponse> getAll();

    MauSacResponse getById(Long id);

    void delete(Long id);

    List<SimpleResponse> getAllClient();
}
