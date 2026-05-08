import { useEffect, useState } from "react";
import cartApi from "../../api/cartApi";
import checkoutApi from "../../api/checkoutApi";
import diaChiApi from "../../api/diaChiApi";
import voucherApi from "../../api/voucherApi";
import "./Checkout.css";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  const [voucher, setVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tenKhachHang: "",
    sdt: "",
    email: "",
    phuongThuc: 1,
    diaChiCuThe: "",
    xa: "",
    huyen: "",
    tinh: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    loadCart(user.id);
    loadAddresses();
    loadVouchers();

    setForm((prev) => ({
      ...prev,
      tenKhachHang: user.ten || "",
      sdt: user.soDienThoai || "",
      email: user.email || "",
    }));
  }, []);

  const loadCart = async (userId) => {
    try {
      const res = await cartApi.getMyCart(userId);

      const mapped = res.items.map((item) => ({
        id: item.id,
        tenSanPham: item.tenSanPham,
        gia: item.gia,
        soLuong: item.soLuong,
      }));

      setItems(mapped);
      setTotal(res.total);
    } catch (err) {
      console.error("Lỗi load giỏ hàng", err);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await diaChiApi.getMyAddresses();
      setAddresses(res || []);
    } catch (err) {
      console.error("Lỗi load địa chỉ", err);
    }
  };

  const loadVouchers = async () => {
    try {
      const res = await voucherApi.getAll();
      const now = new Date();

      const valid = res.filter(
        (v) =>
          v.trangThai === 1 &&
          (!v.ngayBatDau || new Date(v.ngayBatDau) <= now) &&
          (!v.ngayKetThuc || new Date(v.ngayKetThuc) >= now)
      );

      setVouchers(valid);
    } catch (err) {
      console.error("Lỗi load voucher", err);
    }
  };

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "phuongThuc" ? Number(value) : value,
    }));
  };

  // ================= ADDRESS =================
  const handleSelectAddress = (e) => {
    const id = e.target.value;
    const addr = addresses.find((a) => a.id === Number(id));
    if (!addr) return;

    setForm((prev) => ({
      ...prev,
      diaChiCuThe: addr.diaChiCuThe || "",
      xa: addr.phuongXa || "",
      huyen: addr.quanHuyen || "",
      tinh: addr.tinhThanh || "",
    }));
  };

  // ================= VOUCHER =================
  const handleSelectVoucher = (e) => {
    const id = e.target.value;
    const v = vouchers.find((x) => x.id === Number(id));

    if (!v) {
      setVoucher(null);
      setDiscount(0);
      return;
    }

    if (total < (v.giaTriToiThieu || 0)) {
      alert(`Đơn tối thiểu ${v.giaTriToiThieu?.toLocaleString()}đ`);
      return;
    }

    let discountValue = (total * v.phanTramGiam) / 100;

    if (v.giaTriToiDa && discountValue > v.giaTriToiDa) {
      discountValue = v.giaTriToiDa;
    }

    setVoucher(v);
    setDiscount(discountValue);
  };

  // ================= VALIDATE =================
  const validate = () => {
    if (!form.tenKhachHang.trim()) return "Chưa nhập tên khách";
    if (!form.sdt.trim()) return "Chưa nhập số điện thoại";

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(form.sdt)) return "SĐT không hợp lệ";

    if (!form.diaChiCuThe || !form.xa || !form.huyen || !form.tinh) {
      return "Nhập đầy đủ địa chỉ";
    }

    if (items.length === 0) return "Giỏ hàng trống";

    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      setLoading(true);

      const payload = {
        ...form,
        customerId: user.id,
        voucherId: voucher?.id || null,
        tongTien: finalTotal,
      };

      if (form.phuongThuc === 1) {
        try {
          const res = await checkoutApi.createVnpay(user.id, payload);

          if (res?.paymentUrl) {
            window.location.href = res.paymentUrl;
            return;
          }

          alert("Không thể tạo thanh toán VNPay");
          return;
        } catch (err) {
          alert(err.message || "Lỗi thanh toán");
          return;
        }
      }

      await checkoutApi.checkout(payload);

      alert("Đặt hàng thành công!");
      window.location.href = "/orders";
    } catch (err) {
 console.error("CHECKOUT ERROR:", err);
  alert(err.message);
} finally {
      setLoading(false);
    }
  };

  const shipFee = 30000;
  const finalTotal = Math.max(0, total + shipFee - discount);

  return (
    <div className="checkout-container">
      <h2>Thanh toán</h2>

      <div className="checkout-grid">
        {/* LEFT */}
        <div className="checkout-left">
          <h3>Thông tin nhận hàng</h3>

          <select onChange={handleSelectAddress}>
            <option value="">-- Chọn địa chỉ --</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.ten} - {addr.diaChiCuThe}
              </option>
            ))}
          </select>

          <select onChange={handleSelectVoucher}>
            <option value="">-- Chọn voucher --</option>
            {vouchers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.ma} - {v.phanTramGiam}%
              </option>
            ))}
          </select>

          <input name="tenKhachHang" value={form.tenKhachHang} onChange={handleChange} placeholder="Tên khách" />
          <input name="sdt" value={form.sdt} onChange={handleChange} placeholder="SĐT" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

          <input name="diaChiCuThe" value={form.diaChiCuThe} onChange={handleChange} placeholder="Địa chỉ cụ thể" />

          <div className="address-row">
            <input name="xa" value={form.xa} onChange={handleChange} placeholder="Xã" />
            <input name="huyen" value={form.huyen} onChange={handleChange} placeholder="Huyện" />
            <input name="tinh" value={form.tinh} onChange={handleChange} placeholder="Tỉnh" />
          </div>

          <select name="phuongThuc" value={form.phuongThuc} onChange={handleChange}>
            <option value={1}>VNPay</option>
            <option value={2}>COD</option>
          </select>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h3>Đơn hàng</h3>

          {items.map((item) => (
            <div key={item.id}>
              {item.tenSanPham} x{item.soLuong} - {(item.gia * item.soLuong).toLocaleString()}đ
            </div>
          ))}

          <hr />

          <p>Tạm tính: {total.toLocaleString()}đ</p>
          <p>Ship: {shipFee.toLocaleString()}đ</p>
          <p>Giảm: -{discount.toLocaleString()}đ</p>
          <h3>Tổng: {finalTotal.toLocaleString()}đ</h3>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}