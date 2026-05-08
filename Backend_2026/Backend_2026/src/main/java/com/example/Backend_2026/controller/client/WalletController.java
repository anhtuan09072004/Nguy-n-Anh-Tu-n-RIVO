package com.example.Backend_2026.controller.client;

import com.example.Backend_2026.entity.GiaoDich;
import com.example.Backend_2026.infrastructure.request.KiemTraSoDuRequest;
import com.example.Backend_2026.infrastructure.request.NapTienRequest;
import com.example.Backend_2026.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/nap-tien")
    public ResponseEntity<?> napTien(@RequestBody NapTienRequest req) {
        walletService.napTien(req.getUserId(), req.getAmount());
        return ResponseEntity.ok("Nạp tiền thành công");
    }

    @GetMapping("/so-du/{id}")
    public ResponseEntity<BigDecimal> getSoDu(@PathVariable Long id) {
        return ResponseEntity.ok(walletService.getSoDu(id));
    }

    @GetMapping("/lich-su/{id}")
    public ResponseEntity<List<GiaoDich>> lichSu(@PathVariable Long id) {
        return ResponseEntity.ok(walletService.getLichSu(id));
    }

    @PostMapping("/kiem-tra-so-du")
    public ResponseEntity<?> kiemTraSoDu(@RequestBody KiemTraSoDuRequest req) {
        return ResponseEntity.ok(
                walletService.kiemTraSoDu(req.getUserId(), req.getSoTien())
        );
    }
}