package com.example.Backend_2026.service.impl;
import com.example.Backend_2026.entity.HoaDon;
import com.example.Backend_2026.entity.HoaDonChiTiet;
import com.example.Backend_2026.repository.HoaDonChiTietRepository;
import com.example.Backend_2026.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final HoaDonChiTietRepository ctRepo;

    @Override
    public void sendOrderSuccess(HoaDon hoaDon) {
        if (hoaDon.getEmail() == null || hoaDon.getEmail().isBlank()) {
            return;
        }

        List<HoaDonChiTiet> items = ctRepo.findByHoaDonId(hoaDon.getId());

        StringBuilder content = new StringBuilder();

        content.append("Cảm ơn bạn đã mua hàng tại RiVoPoLy Shop.\n\n");
        content.append("Mã đơn hàng: ").append(hoaDon.getMa()).append("\n");
        content.append("Khách hàng: ").append(hoaDon.getTenKhachHang()).append("\n");
        content.append("SĐT: ").append(hoaDon.getPhoneNumber()).append("\n");
        content.append("Địa chỉ: ").append(hoaDon.getDiaChi()).append("\n\n");

        content.append("Sản phẩm:\n");

        for (HoaDonChiTiet item : items) {
            content.append("- ")
                    .append(item.getChiTietSanPham().getSanPham().getTen())
                    .append(" | SL: ")
                    .append(item.getSoLuong())
                    .append(" | Giá: ")
                    .append(item.getGia())
                    .append("\n");
        }

        content.append("\nPhí ship: ").append(hoaDon.getTienShip()).append("đ");
        content.append("\nGiảm giá: ").append(hoaDon.getTienGiam()).append("đ");
        content.append("\nTổng thanh toán: ").append(hoaDon.getTongTien()).append("đ");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(hoaDon.getEmail());
        message.setSubject("Xác nhận đơn hàng " + hoaDon.getMa());
        message.setText(content.toString());

        mailSender.send(message);
    }
}
