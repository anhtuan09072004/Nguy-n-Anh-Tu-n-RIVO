package com.example.Backend_2026.controller.client;
import com.example.Backend_2026.infrastructure.response.SanPhamClientListResponse;
import com.example.Backend_2026.infrastructure.response.SanPhamResponse;
import com.example.Backend_2026.infrastructure.response.Top8SanPhamResponse;
import com.example.Backend_2026.infrastructure.response.TopSanPhamResponse;
import com.example.Backend_2026.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/san-pham")
@RequiredArgsConstructor
@CrossOrigin("*") // cho React gọi
public class SanPhamClientController {
    private final SanPhamService sanPhamService;

    @GetMapping("/{id}")
    public SanPhamResponse getById(@PathVariable Long id) {
        return sanPhamService.getById(id);
    }

    @GetMapping("/filter")
    public List<SanPhamClientListResponse> filter(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long thuongHieuId,
            @RequestParam(required = false) Long xuatXuId
    ) {
        return sanPhamService.filter(keyword, thuongHieuId, xuatXuId);
    }


    @GetMapping("/top-ban-chay")
    public List<Top8SanPhamResponse> getTopSanPhamBanChay() {
        return sanPhamService.getTop8SanPhamBanChay();
    }
}
