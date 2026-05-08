import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import "./GioHang.css";

export default function GioHang() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      return;
    }

    if (!user?.id) return;

    loadCart(user.id);
  }, []);

  const loadCart = (userId) => {
    cartApi
      .getMyCart(userId)
      .then((res) => {
        const mapped = (res.items || []).map((item) => ({
          id: item.id,
          tenSanPham: item.tenSanPham,
          mau: item.mauSac,
          size: item.kichCo,
          gia: item.gia,
          anh: item.hinhAnh,
          soLuong: item.soLuong,
          tonKho: item.tonKho,
        }));

        setItems(mapped);
        setTotal(res.total || 0);
      })
      .catch(console.error);
  };

  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:8080/uploads/${img}`;
  };

  const handleUpdate = (id, newQty) => {
      const item = items.find((x) => x.id === id);
      if (!item) return;

      if (newQty < 1) return;

      if (newQty > item.tonKho) {
        alert(`Chỉ còn ${item.tonKho} sản phẩm trong kho`);
        return;
      }

      cartApi
        .updateQuantity(id, newQty)
        .then(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          loadCart(user.id);
        })
        .catch(console.error);
    };
  const handleDelete = (id) => {
    cartApi
      .deleteItem(id)
      .then(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        loadCart(user.id);
      })
      .catch(console.error);
  };

  return (
    <div className="gh-page">
      <div className="gh-header-top">
        <h2>Giỏ hàng của bạn</h2>
        <span>{items.length} sản phẩm</span>
      </div>

      {items.length === 0 ? (
        <div className="gh-empty">
          <p>Giỏ hàng của bạn đang trống</p>

          <button
            className="gh-empty-btn"
            onClick={() => navigate("/san-pham")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="gh-table-head">
            <span>Sản phẩm</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
            <span></span>
          </div>

          <div className="gh-list">
            {items.map((item) => (
              <div className="gh-row" key={item.id}>
                <div className="gh-product">
                  <img
                    src={getImageUrl(item.anh)}
                    alt={item.tenSanPham}
                    className="gh-img"
                  />

                  <div className="gh-product-info">
                    <h4>{item.tenSanPham}</h4>
                    <p>Màu: {item.mau}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </div>

                <div className="gh-price">
                  {item.gia?.toLocaleString("vi-VN")}đ
                </div>

                <div className="gh-qty">
                  <button
                    onClick={() =>
                      handleUpdate(item.id, item.soLuong - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.soLuong}</span>

                  <button
                    disabled={item.soLuong >= item.tonKho}
                      onClick={() =>
                        handleUpdate(item.id, item.soLuong + 1)
                      }
                    >
                      +
                  </button>
                </div>

                <div className="gh-subtotal">
                  {(item.gia * item.soLuong).toLocaleString("vi-VN")}đ
                </div>

                <div className="gh-delete">
                  <button onClick={() => handleDelete(item.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="gh-footer">
            <div className="gh-summary">
              <p>
                Tổng thanh toán
                <span>{total?.toLocaleString("vi-VN")}đ</span>
              </p>
            </div>

            <div className="gh-actions">
              <button
                className="gh-continue-btn"
                onClick={() => navigate("/san-pham")}
              >
                Tiếp tục mua
              </button>

              <button
                className="gh-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}