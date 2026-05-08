package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.*;
import com.example.Backend_2026.infrastructure.converter.SanPhamChiTietConverter;
import com.example.Backend_2026.infrastructure.request.SanPhamChiTietRequest;
import com.example.Backend_2026.infrastructure.response.SanPhamChiTietResponse;
import com.example.Backend_2026.repository.*;
import com.example.Backend_2026.service.SanPhamChiTietService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SanPhamChiTietServiceImpl implements SanPhamChiTietService {

    private final SanPhamChiTietRepository repository;
    private final SanPhamChiTietConverter converter;
    private final SanPhamRepository sanPhamRepository;
    private final KichCoRepository kichCoRepository;
    private final MauSacRepository mauSacRepository;
    private final HinhAnhRepository hinhAnhRepository;

    // Create
    @Override
    public SanPhamChiTietResponse create(
            SanPhamChiTietRequest request,
            List<MultipartFile> files
    ) {
        //vali bien the
        if (repository.existsBySanPhamIdAndKichCoIdAndMauSacIdAndDaXoaFalse(
                request.getSanPhamId(),
                request.getKichCoId(),
                request.getMauSacId()
        )) {
            throw new RuntimeException("Biến thể đã tồn tại (trùng kích cỡ + màu sắc)");
        }

            // vali ma
        if (repository.existsByMaAndDaXoaFalse(request.getMa())) {
            throw new RuntimeException("Mã sản phẩm đã tồn tại");
        }

        SanPhamChiTiet entity = converter.toEntity(request);
        entity.setDaXoa(false);

        SanPhamChiTiet saved = repository.save(entity);

        // upload file
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String url;

                try {
                    url = uploadFile(file);
                } catch (IOException e) {
                    throw new RuntimeException("Upload file thất bại", e);
                }

                HinhAnh ha = new HinhAnh();
                ha.setTen(url);
                ha.setSanPhamChiTiet(saved);

                hinhAnhRepository.save(ha);
            }
        }

        return converter.toResponse(saved);
    }

    // sua////////////////////////////////////////////////////////////
    @Transactional
    @Override
    public SanPhamChiTietResponse update(Long id, SanPhamChiTietRequest request, List<MultipartFile> files) {

        SanPhamChiTiet entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết"));

        SanPham sanPham = sanPhamRepository.findById(request.getSanPhamId())
                .orElseThrow(() -> new RuntimeException("SP không tồn tại"));
        entity.setSanPham(sanPham);

        KichCo kichCo = kichCoRepository.findById(request.getKichCoId())
                .orElseThrow(() -> new RuntimeException("Size không tồn tại"));
        entity.setKichCo(kichCo);

        MauSac mauSac = mauSacRepository.findById(request.getMauSacId())
                .orElseThrow(() -> new RuntimeException("Màu sắc không tồn tại"));
        entity.setMauSac(mauSac);
        // vali bien the
        if (repository.existsBySanPhamIdAndKichCoIdAndMauSacIdAndIdNotAndDaXoaFalse(
                request.getSanPhamId(),
                request.getKichCoId(),
                request.getMauSacId(),
                id
        )) {
            throw new RuntimeException("Biến thể đã tồn tại (trùng kích cỡ + màu sắc)");
        }

        // vali ma
        if (repository.existsByMaAndIdNotAndDaXoaFalse(request.getMa(), id)) {
            throw new RuntimeException("Mã sản phẩm đã tồn tại");
        }

        entity.setGia(request.getGia());
        entity.setSoLuong(request.getSoLuong());
        entity.setMa(request.getMa());

        SanPhamChiTiet saved = repository.save(entity);

        // update ảnh
        if (files != null && !files.isEmpty()) {

            //bỏ ảnh cũ
            hinhAnhRepository.deleteBySanPhamChiTietId(id);

            // lưu lai ảnh mới
            for (MultipartFile file : files) {

                String url;
                try {
                    url = uploadFile(file);
                } catch (IOException e) {
                    throw new RuntimeException("Upload file thất bại", e);
                }

                HinhAnh ha = new HinhAnh();
                ha.setTen(url);
                ha.setSanPhamChiTiet(saved);

                hinhAnhRepository.save(ha);
            }
        }

        return converter.toResponse(saved);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    @Override
    public SanPhamChiTietResponse getById(Long id) {

        SanPhamChiTiet entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy spct"));

        return converter.toResponse(entity);
    }

    /// /////////////////////////////////////////////////////////////////////////////////////
    @Override
    public List<SanPhamChiTietResponse> getAll() {

        return repository.findAll()
                .stream()
                .filter(spct -> Boolean.FALSE.equals(spct.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    // xoa
    @Transactional
    @Override
    public void delete(Long id) {

        SanPhamChiTiet entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết"));

        entity.setDaXoa(true);
        repository.save(entity);

        // xoá ảnh kèm
        hinhAnhRepository.deleteBySanPhamChiTietId(id);
    }

    // ================= Lấy theo  SPham =================///////////////////////////////////////
    @Override
    public List<SanPhamChiTietResponse> getBySanPhamId(Long sanPhamId) {

        return repository.findBySanPhamIdAndDaXoaFalse(sanPhamId)
                .stream()
                .map(converter::toResponse)
                .toList();
    }


    private String uploadFile(MultipartFile file) throws IOException {

        String uploadDir = "uploads/";

        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.write(path, file.getBytes());

        return "http://localhost:8080/uploads/" + fileName;
    }


    @Override
    public List<SanPhamChiTietResponse> search(String keyword) {
        // nếu rỗng → lấy tất cả
        List<SanPhamChiTiet> list;

        if (keyword == null || keyword.trim().isEmpty()) {
            list = repository.findAll();
        } else {
            list = repository.search(keyword);
        }

        return list.stream()
                .map(converter::toResponse)
                .toList();
    }


    @Override
    public SanPhamChiTiet save(SanPhamChiTiet ctsp) {
        return repository.save(ctsp);
    }


}