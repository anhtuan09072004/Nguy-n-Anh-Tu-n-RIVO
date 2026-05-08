package com.example.Backend_2026.controller.admin;

import com.example.Backend_2026.infrastructure.request.SanPhamChiTietRequest;
import com.example.Backend_2026.infrastructure.response.SanPhamChiTietResponse;
import com.example.Backend_2026.service.SanPhamChiTietService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Validated
@RestController
@RequestMapping(value = "/api/san-pham-chi-tiet", produces = "application/json")
@RequiredArgsConstructor
public class SanPhamChiTietController {
    private final SanPhamChiTietService service;


    @GetMapping("/san-pham/{sanPhamId}")
    public ResponseEntity<List<SanPhamChiTietResponse>> getBySanPham(
            @PathVariable Long sanPhamId) {
        return ResponseEntity.ok(service.getBySanPhamId(sanPhamId));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> create(
            @Valid@RequestPart("request") SanPhamChiTietRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(service.create(request, files));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid
            @RequestPart("request") SanPhamChiTietRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(service.update(id, request, files));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Xóa thành công");
    }

    @GetMapping("/search")
    public List<SanPhamChiTietResponse> search(
            @RequestParam(required = false) String keyword
    ) {
        return service.search(keyword);
    }
}
