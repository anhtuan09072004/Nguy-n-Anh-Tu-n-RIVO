import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/client/orders";

// ===== helper gọi API =====
const getMyOrders = async (userId) => {
  const res = await fetch(`${BASE_URL}/my?userId=${userId}`);

  if (!res.ok) {
    throw new Error("Không thể tải đơn hàng");
  }

  return await res.json();
};

// ===== map trạng thái =====
const mapStatus = (s) => {
  const status = Number(s);

  switch (status) {
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ===== load orders =====
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Bạn chưa đăng nhập");
      navigate("/login");
      return;
    }

    getMyOrders(user.id)
      .then((data) => setOrders(data))
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ===== payment confirm =====
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");

    if (payment === "success") {
      alert("Thanh toán thành công!");

      // xoá query sau khi alert
      navigate("/orders", { replace: true });
    }

    if (payment === "failed") {
      alert("Thanh toán thất bại!");

      // xoá query sau khi alert
      navigate("/orders", { replace: true });
    }
  }, [location.search, navigate]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Đang tải đơn hàng...</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>📦 Đơn hàng của tôi</h2>

      {orders.length === 0 && <p>Chưa có đơn hàng nào</p>}

      {orders.map((o) => {
        const status = mapStatus(o.trangThai);

        return (
          <div
            key={o.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>Mã: {o.ma}</b>
              <span style={{ color: status.color }}>{status.text}</span>
            </div>

            <p>👤 {o.tenKhachHang}</p>
            <p>📞 {o.sdt}</p>

            <p>
              💰 Tổng tiền: <b>{o.tongTien?.toLocaleString()}đ</b>
            </p>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => navigate(`/orders/${o.id}`)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#1890ff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}