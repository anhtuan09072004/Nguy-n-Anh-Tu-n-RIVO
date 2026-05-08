import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await authApi.login(form);

      // lưu user
      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("userId", res.id);

      navigate("/");
    } catch (err) {
      alert(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          onClick={handleLogin}
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <button
          onClick={() => navigate("/register")}
          className="register-btn"
          disabled={loading}
        >
          Đăng ký tài khoản mới
        </button>

        <div className="login-footer">
          © 2026 Your App
        </div>
      </div>
    </div>
  );
}