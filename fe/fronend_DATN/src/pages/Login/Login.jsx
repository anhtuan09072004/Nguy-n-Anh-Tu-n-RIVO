import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", form);

      localStorage.setItem("user", JSON.stringify(res.data));

      const role = res.data?.vaiTro?.ten || res.data?.role;

      if (role === "ADMIN" || role === "NHANVIEN") {
        navigate("/ban-hang");
      } else {
        setError("Tài khoản không có quyền truy cập");
      }
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}