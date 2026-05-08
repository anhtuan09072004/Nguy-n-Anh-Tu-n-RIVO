package com.example.Backend_2026.controller.client;

import com.example.Backend_2026.infrastructure.response.SimpleResponse;
import com.example.Backend_2026.service.MauSacService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/client/mau-sac")
@RequiredArgsConstructor
public class MauSacClientController {
    private final MauSacService service;

    @GetMapping
    public List<SimpleResponse> getAll() {
        return service.getAllClient();
    }

}
