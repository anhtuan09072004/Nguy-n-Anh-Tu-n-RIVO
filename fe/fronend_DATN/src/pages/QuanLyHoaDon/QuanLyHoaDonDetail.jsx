import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import quanLyHoaDonApi from "../../api/quanLyHoaDonApi";
import hoaDonChiTietApi from "../../api/hoaDonChiTietApi";
import "./QuanLyHoaDon.css";

export default function QuanLyHoaDonDetail() {
  const { id } = useParams();
  const [hoaDon, setHoaDon] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const [resHoaDon, resItems] = await Promise.all([
        quanLyHoaDonApi.getDetail(id),
        hoaDonChiTietApi.getByHoaDon(id),
      ]);

      setHoaDon(resHoaDon.data);
      setItems(resItems.data || []);
    } catch (err) {
      console.error("Lỗi load detail:", err);
    }
  };

  // 👉 Format hình thức
  const formatHinhThuc = (type) => {
    switch (Number(type)) {
      case 0:
        return "Tại quầy";
      case 1:
        return "Giao hàng";
      default:
        return "Không rõ";
    }
  };

  // 👉 Step cho ONLINE
  const steps = [
    { key: 1, label: "Chờ xác nhận" },
    { key: 2, label: "Đã xác nhận" },
    { key: 3, label: "Chờ lấy hàng" },
    { key: 4, label: "Đang giao" },
    { key: 5, label: "Hoàn thành" },
  ];

  // 👉 Update trạng thái (có validate)
  const handleUpdateStatus = async (newStatus) => {
      try {
        const current = Number(hoaDon.trangThai);

        // ❌ Không cho update nếu đã hoàn thành / hủy
        if ([5, 6, 7].includes(current)) {
          alert("⚠️ Không thể cập nhật nữa");
          return;
        }

        // ❌ Không cho nhảy bước
        if (newStatus !== current + 1) {
          alert("Ko hợp lệ !");
          return;
        }

        // ✅ THÊM ĐOẠN NÀY (confirm)
        const stepLabel = steps.find(s => s.key === newStatus)?.label;
        const isOk = window.confirm(`Bạn có chắc muốn chuyển sang "${stepLabel}" không?`);
        if (!isOk) return;

        // 👉 gọi API
        await quanLyHoaDonApi.updateStatus(id, newStatus);

        // 👉 reload lại data
        fetchDetail();

      } catch (err) {
        console.error("Lỗi update trạng thái:", err);
        alert("❌ Cập nhật thất bại");
      }
    };
  if (!hoaDon) return <p>Loading...</p>;

  return (
    <div className="qlhd-container">
      <h2 className="title">Chi tiết hóa đơn #{hoaDon.id}</h2>

      {/* ✅ STEP PROGRESS (chỉ cho đơn ONLINE) */}
      {Number(hoaDon.kieuHoaDon) === 1 && (
        <div className="step-wrapper">
          {steps.map((step, index) => {
            const current = Number(hoaDon.trangThai);
            const isActive = current >= step.key;
            const isNext = current + 1 === step.key;

            return (
              <div key={step.key} className="step-item">

                {/* line */}
                {index !== 0 && (
                  <div className={`step-line ${current >= step.key ? "active" : ""}`} />
                )}

                {/* circle */}
                <div
                  className={`step-circle 
                    ${isActive ? "active" : ""} 
                    ${isNext ? "next" : ""}`}
                  onClick={() => handleUpdateStatus(step.key)}
                >
                  {step.key}
                </div>

                {/* label */}
                <div className="step-label">{step.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ❌ Nếu bị hủy */}
      {Number(hoaDon.trangThai) === 6 && (
        <div className="status-cancel">❌ Đơn hàng đã bị hủy</div>
      )}

      {/* INFO */}
      <div className="detail-box">
        <p><b>Khách:</b> {hoaDon.tenKhachHang}</p>
        <p><b>SĐT:</b> {hoaDon.sdt}</p>

        <p>
          <b>Hình thức:</b> {formatHinhThuc(hoaDon.kieuHoaDon)}
        </p>

        <p>
          <b>Tổng tiền:</b> {hoaDon.tongTien?.toLocaleString()} đ
        </p>

        {Number(hoaDon.kieuHoaDon) === 1 && (
          <p className="address">
            <b>Địa chỉ:</b> {hoaDon.diaChi || "Không có"}
          </p>
        )}
      </div>

      {/* TABLE */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Màu</th>        {/* 👈 thêm */}
                <th>Size</th>       {/* 👈 thêm */}
                <th>Giá</th>
                <th>SL</th>
                <th>Thành tiền</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.hinhAnh}
                      className="img"
                      onError={(e) =>
                        (e.target.src = "/no-image.png")
                      }
                    />
                  </td>

                  <td>{item.tenSanPham}</td>

                  {/* 👇 thêm 2 cột */}
                  <td>{item.mauSac || "-"}</td>
                  <td>{item.kichCo || "-"}</td>

                  <td>{item.gia?.toLocaleString()} đ</td>
                  <td>{item.soLuong}</td>
                  <td>
                    {(item.gia * item.soLuong)?.toLocaleString()} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}