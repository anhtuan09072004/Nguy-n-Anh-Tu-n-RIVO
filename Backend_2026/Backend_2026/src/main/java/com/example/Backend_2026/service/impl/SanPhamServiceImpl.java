package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.*;
import com.example.Backend_2026.infrastructure.converter.SanPhamConverter;
import com.example.Backend_2026.infrastructure.request.SanPhamRequest;
import com.example.Backend_2026.infrastructure.response.SanPhamClientListResponse;
import com.example.Backend_2026.infrastructure.response.SanPhamResponse;
import com.example.Backend_2026.infrastructure.response.Top8SanPhamResponse;
import com.example.Backend_2026.infrastructure.response.TopSanPhamResponse;
import com.example.Backend_2026.repository.*;
import com.example.Backend_2026.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SanPhamServiceImpl implements SanPhamService {
    private final SanPhamRepository repository;
    private final ChatLieuRepository chatLieuRepository;
    private final ThuongHieuRepository thuongHieuRepository;
    private final XuatXuRepository xuatXuRepository;
    private final CoAoRepository coAoRepository;
    private final TayAoRepository tayAoRepository;


    private final SanPhamConverter converter;
    @Override
    public SanPhamResponse create(SanPhamRequest request) {
        SanPham entity = converter.toEntity(request);
        entity.setDaXoa(false);

        SanPham saved = repository.save(entity);
        return converter.toResponse(saved);
    }

    @Override
    public SanPhamResponse getById(Long id) {
        SanPham entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tay ao "));

        return converter.toResponse(entity);
    }

    @Override
    public List<SanPhamResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public SanPhamResponse update(Long id, SanPhamRequest request) {

        SanPham entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        entity.setTen(request.getTen());
        entity.setMa(request.getMa());
        entity.setMoTa(request.getMoTa());

        ChatLieu chatLieu = chatLieuRepository.findById(request.getChatLieuId())
                .orElseThrow(() -> new RuntimeException("Chất liệu không tồn tại"));
        entity.setChatLieu(chatLieu);

        ThuongHieu thuongHieu = thuongHieuRepository.findById(request.getThuongHieuId())
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại"));
        entity.setThuongHieu(thuongHieu);

        XuatXu xuatXu = xuatXuRepository.findById(request.getXuatXuId())
                .orElseThrow(() -> new RuntimeException("Xuất xứ không tồn tại"));
        entity.setXuatXu(xuatXu);

        CoAo coAo = coAoRepository.findById(request.getCoAoId())
                .orElseThrow(() -> new RuntimeException("Cổ áo không tồn tại"));
        entity.setCoAo(coAo);

        TayAo tayAo = tayAoRepository.findById(request.getTayAoId())
                .orElseThrow(() -> new RuntimeException("Tay áo không tồn tại"));
        entity.setTayAo(tayAo);

        entity.setCapNhatLuc(LocalDateTime.now());

        SanPham saved = repository.save(entity);

        return converter.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        SanPham entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tay ao"));

        entity.setDaXoa(true);
        repository.save(entity);
    }

    @Override
    public List<Top8SanPhamResponse> getTop8SanPhamBanChay() {
        List<Object[]> list = repository.getTop8Raw();

        return list.stream().map(o -> Top8SanPhamResponse.builder()
                .id(((Number) o[0]).longValue())
                .ten((String) o[1])
                .tongDaBan(o[2] != null ? ((Number) o[2]).longValue() : 0)
                .giaMin((BigDecimal) o[3])
                .giaMax((BigDecimal) o[4])
                .hinhAnh((String) o[5])
                .build()
        ).toList();
    }


    @Override
    public List<SanPhamClientListResponse> filter(String keyword, Long thuongHieuId, Long xuatXuId) {
        return repository.filter(keyword, thuongHieuId, xuatXuId);
    }
}
