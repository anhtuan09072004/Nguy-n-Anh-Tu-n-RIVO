import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.css";

const BASE_URL = "http://localhost:8080/api/client/orders";

const mapStatus = (status) => {
  const s = Number(status);

  switch (s) {
    case 0:
      return { text: "Chờ thanh toán", color: "#faad14" };
    case 1:
      return { text: "Chờ xác nhận", color: "orange" };
    case 2:
      return { text: "Đã xác nhận", color: "#2db7f5" };
    case 3:
      return { text: "Chờ lấy hàng", color: "#722ed1" };
    case 4:
      return { text: "Đang giao hàng", color: "blue" };
    case 5:
      return { text: "Hoàn thành", color: "green" };
    case 6:
      return { text: "Đã hủy", color: "red" };
    default:
      return { text: "Không rõ", color: "gray" };
  }
};

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${BASE_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        console.error("Lỗi load order", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Đang tải...</p>;
  }

  if (!order) {
    return <p style={{ textAlign: "center" }}>Không tìm thấy đơn hàng</p>;
  }

  const status = mapStatus(order.trangThai);

  return (
    <div className="order-detail">
      <h2>Chi tiết đơn hàng</h2>

      <div className="order-info">
        <p>
          <b>Mã đơn:</b> {order.ma}
        </p>
        <p>
          <b>Khách hàng:</b> {order.tenKhachHang}
        </p>
        <p>
          <b>SĐT:</b> {order.sdt}
        </p>
        <p>
          <b>Email:</b> {order.email || "-"}
        </p>
        <p style={{ gridColumn: "1 / -1" }}>
          <b>Địa chỉ:</b> {order.diaChi}
        </p>
      </div>

      <p className="order-status">
        <b>Trạng thái:</b>{" "}
        <span style={{ color: status.color }}>{status.text}</span>
      </p>

      <hr className="order-divider" />

      <h3 className="order-products-title">Sản phẩm</h3>

      {order.items?.length > 0 ? (
        order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="order-item-left">
              <p className="order-item-name">{item.tenSanPham}</p>
              <p className="order-item-meta">
                Màu: {item.mauSac} | Size: {item.kichCo}
              </p>
              <p className="order-item-meta">Số lượng: {item.soLuong}</p>
            </div>

            <div className="order-item-right">
              <p className="order-item-price">
                {(item.gia * item.soLuong).toLocaleString()}đ
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>Không có sản phẩm</p>
      )}

      <hr className="order-divider" />

      <div className="order-summary">
        <p>Phí ship: {order.tienShip?.toLocaleString()}đ</p>
        <p>Giảm giá: -{order.tienGiam?.toLocaleString()}đ</p>

        <h3 className="order-total">
          Thanh toán: {order.tongTien?.toLocaleString()}đ
        </h3>
      </div>
    </div>
  );
}