import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../api/customerApi";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    ten: "",
    username: "",
    password: "",
    email: "",
    soDienThoai: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.ten.trim()) return "Tên không được để trống";
    if (!form.username.trim()) return "Username không được để trống";
    if (!form.password.trim()) return "Password không được để trống";

    if (form.password.length < 6) {
      return "Password phải >= 6 ký tự";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Email không hợp lệ";
    }

    if (form.soDienThoai && !/^\d{9,11}$/.test(form.soDienThoai)) {
      return "SĐT không hợp lệ";
    }

    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      await customerApi.create(form);

      alert("🎉 Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data || err.message || "Đăng ký thất bại";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">📝 Đăng ký khách hàng</h2>

        <div className="register-form">
          <input
            className="register-input"
            placeholder="Tên"
            value={form.ten}
            onChange={(e) => handleChange("ten", e.target.value)}
          />

          <input
            className="register-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          <input
            className="register-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <input
            className="register-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <input
            className="register-input"
            placeholder="SĐT"
            value={form.soDienThoai}
            onChange={(e) => handleChange("soDienThoai", e.target.value)}
          />

          <button
            className="register-btn primary"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <button
            className="register-btn secondary"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}