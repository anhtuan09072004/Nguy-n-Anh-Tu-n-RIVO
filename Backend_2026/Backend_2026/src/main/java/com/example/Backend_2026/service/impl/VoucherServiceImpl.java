package com.example.Backend_2026.service.impl;

import com.example.Backend_2026.entity.Voucher;
import com.example.Backend_2026.infrastructure.converter.VoucherConverter;
import com.example.Backend_2026.infrastructure.exception.NgoaiLe;
import com.example.Backend_2026.infrastructure.request.VoucherRequest;
import com.example.Backend_2026.infrastructure.response.VoucherResponse;
import com.example.Backend_2026.repository.VoucherRepository;
import com.example.Backend_2026.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository repository;
    private final VoucherConverter converter;
    @Override
    public VoucherResponse cretae(VoucherRequest request) {
        if (repository.existsByTen(request.getTen())) {
            throw new NgoaiLe("Tên voucher đã tồn tại");
        }
        if (repository.existsByMa(request.getMa())) {
            throw new NgoaiLe("Ma đã tồn tại ");
        }
        if (request.getTen().length() > 50) {
            throw new NgoaiLe("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getSoLuong() <= 0) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0.");
        }
        if (request.getSoLuong() <= 0 || request.getSoLuong() != (int) request.getSoLuong() || request.getSoLuong() == null) {
            throw new NgoaiLe("Số lượng phải là số nguyên dương.");
        }
        if(request.getSoLuong() >10000){
            throw new NgoaiLe("Số lượng không được vượt quá 10000. ");
        }
        if (request.getPhanTramGiam() == null ||
                request.getPhanTramGiam().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getPhanTramGiam().compareTo(BigDecimal.valueOf(50)) > 0) {
            throw new NgoaiLe("Phần trăm giảm phải từ 1 đến 50");
        }
        if (request.getGiaTriToiThieu().compareTo(BigDecimal.ZERO) < 0) {
            throw new NgoaiLe("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getNgayBatDau().isAfter(request.getNgayKetThuc())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getNgayBatDau().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new NgoaiLe("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }
        if (request.getNgayBatDau().isEqual(request.getNgayKetThuc())) {
            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        LocalDateTime now = LocalDateTime.now();
        if (request.getNgayBatDau().isAfter(now)) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn hoặc bằng thời điểm hiện tại");
        }

        Voucher entity = converter.toEntity(request);
        entity.setDaXoa(false);
        Voucher saved = repository.save(entity);
        return converter.toResponse(saved);
    }

    @Override
    public VoucherResponse update(Long id, VoucherRequest request) {
        Voucher entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

        if (repository.existsByTenAndIdNot(request.getTen(), id)) {
            throw new NgoaiLe("Tên voucher đã tồn tại");
        }
        if (repository.existsByMaAndIdNot(request.getMa(), id)) {
            throw new NgoaiLe("Ma đã tồn tại ");
        }
        if (request.getTen().length() > 50) {
            throw new NgoaiLe("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getSoLuong() <= 0) {
            throw new NgoaiLe("Số lượng phải lớn hơn 0.");
        }
        if (request.getSoLuong() == null || request.getSoLuong() <= 0) {
            throw new NgoaiLe("Số lượng phải là số nguyên dương.");
        }

        if (request.getSoLuong() > 10000) {
            throw new NgoaiLe("Số lượng không được vượt quá 10000.");
        }
        if (request.getPhanTramGiam() == null ||
                request.getPhanTramGiam().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getPhanTramGiam().compareTo(BigDecimal.valueOf(50)) > 0) {
            throw new NgoaiLe("Phần trăm giảm phải từ 1 đến 50");
        }
        if (request.getGiaTriToiThieu().compareTo(BigDecimal.ZERO) < 0) {
            throw new NgoaiLe("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getNgayBatDau().isAfter(request.getNgayKetThuc())) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
//        if (request.getNgayBatDau().isBefore(LocalDateTime.now())) {
//            throw new NgoaiLe("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
//        }
        if (request.getNgayBatDau().isEqual(request.getNgayKetThuc())) {
            throw new NgoaiLe("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        LocalDateTime now = LocalDateTime.now();

        if (request.getNgayBatDau().isAfter(now)) {
            throw new NgoaiLe("Ngày bắt đầu phải nhỏ hơn hoặc bằng thời điểm hiện tại");
        }


        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setSoLuong(request.getSoLuong());
        entity.setPhanTramGiam(request.getPhanTramGiam());
        entity.setGiaTriToiDa(request.getGiaTriToiDa());
        entity.setGiaTriToiThieu(request.getGiaTriToiThieu());
        entity.setNgayBatDau(request.getNgayBatDau());
        entity.setNgayKetThuc(request.getNgayKetThuc());
        entity.setTrangThai(request.getTrangThai());

        return converter.toResponse(repository.save(entity));
    }

    @Override
    public List<VoucherResponse> getAll() {
        return repository.findAll()
                .stream()
                .filter(ms -> Boolean.FALSE.equals(ms.getDaXoa()))
                .map(converter::toResponse)
                .toList();
    }

    @Override
    public VoucherResponse getById(Long id) {
        Voucher entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vouxher"));

        return converter.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        Voucher entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vouxher"));
        entity.setDaXoa(true);
        repository.save(entity);
    }

    @Override
    public Voucher findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher với id = " + id));
    }


    @Scheduled(fixedRate = 60000) // chạy mỗi 60 giây
    @Transactional
    public void updateVoucherStatus() {
        List<Voucher> vouchers = repository.findAll();

        LocalDateTime now = LocalDateTime.now();

        for (Voucher v : vouchers) {
            // Nếu hết hạn hoặc hết số lượng → chuyển trạng thái = 0
            if (v.getNgayKetThuc().isBefore(now) || v.getSoLuong() <= 0) {
                if (v.getTrangThai() != 0) {
                    v.setTrangThai(0);
                }
            }

            // Nếu còn hạn và còn số lượng → trạng thái = 1
//            else if (v.getNgayBatDau().isBefore(now) && v.getSoLuong() > 0) {
//                if (v.getTrangThai() != 1) {
//                    v.setTrangThai(1);
//                }
//            }
        }

        repository.saveAll(vouchers);
    }
}
