package com.example.Backend_2026.service;

import com.example.Backend_2026.infrastructure.request.ChatLieuRequest;
import com.example.Backend_2026.infrastructure.request.ThuongHieuRequest;
import com.example.Backend_2026.infrastructure.response.ChatLieuResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.infrastructure.response.ThuongHieuResponse;

import java.util.List;

public interface ThuongHieuService {
    ThuongHieuResponse create(ThuongHieuRequest request);
    ThuongHieuResponse update(Long id , ThuongHieuRequest request);
    List<ThuongHieuResponse> getAll();
    ThuongHieuResponse getById(Long id);
    void delete(Long id);
    List<SimpleResponse> getAllClient();
}
