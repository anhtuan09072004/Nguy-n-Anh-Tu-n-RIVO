package com.example.Backend_2026.controller.client;


import com.example.Backend_2026.infrastructure.response.SanPhamChiTietResponse;
import com.example.Backend_2026.service.SanPhamChiTietService;
import com.example.Backend_2026.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/san-pham-chi-tiet")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SanPhamChiTietClientController {
    private final SanPhamChiTietService sanPhamChiTietServiceService;

    @GetMapping("/san-pham/{sanPhamId}")
    public List<SanPhamChiTietResponse> getBySanPhamId(
            @PathVariable Long sanPhamId) {
        return sanPhamChiTietServiceService.getBySanPhamId(sanPhamId);
    }
}
