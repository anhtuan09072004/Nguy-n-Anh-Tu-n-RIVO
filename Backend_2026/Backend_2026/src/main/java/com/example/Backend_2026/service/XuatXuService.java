package com.example.Backend_2026.service;

import com.example.Backend_2026.infrastructure.request.ChatLieuRequest;
import com.example.Backend_2026.infrastructure.request.XuatXuRequest;
import com.example.Backend_2026.infrastructure.response.ChatLieuResponse;
import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.infrastructure.response.XuatXuResponse;

import java.util.List;

public interface XuatXuService {
    XuatXuResponse create(XuatXuRequest request);
    XuatXuResponse update(Long id , XuatXuRequest request);
    List<XuatXuResponse> getAll();
    XuatXuResponse getById(Long id);
    void delete(Long id);
    List<SimpleResponse> getAllClient();

}
