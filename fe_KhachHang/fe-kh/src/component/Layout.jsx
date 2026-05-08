import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";
import logo from "./img/logoShop.png";

const menu = [
  { name: "Trang chủ", path: "/" },
  { name: "Sản phẩm", path: "/san-pham" },
  { name: "Đơn hàng", path: "/orders" },
  { name: "Tài khoản", path: "/tai-khoan" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = e.target.keyword.value.trim();

    if (!keyword) return;

    navigate(`/san-pham?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="layout">
      {/* ===== TOP BAR ===== */}
      <div className="header-top">
        <div className="header-top-inner">
          {/* <span>Miễn phí vận chuyển cho đơn từ 299.000đ</span> */}
          <span>Hotline: 0988 888 888</span>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-container">
          {/* LOGO */}
          <Link to="/" className="logo-link">
            <img src={logo} alt="SHOP ÁO" className="logo-img" />
          </Link>

          {/* SEARCH */}
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              name="keyword"
              placeholder="Tìm sản phẩm..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Tìm
            </button>
          </form>

          {/* ACTIONS */}
          <div className="actions">
            <Link to="/gio-hang" className="cart-btn">
              🛒 Giỏ hàng
            </Link>

            {!user ? (
              <Link to="/login" className="login-btn">
                Đăng nhập
              </Link>
            ) : (
              <div className="user-box">
                <span className="welcome-user">
                  Xin chào, {user.ten || user.username}
                </span>

                <button onClick={handleLogout} className="logout-btn">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MENU */}
        <div className="menu-wrapper">
          <nav className="menu">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="content">{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>SHOP ÁO</h4>
            <p>Thời trang nam nữ hiện đại, phong cách trẻ trung.</p>
            <p>Chuyên áo thun, sơ mi, quần jean, phụ kiện.</p>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ khách hàng</h4>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Hướng dẫn mua hàng</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản dịch vụ</a>
          </div>

          <div className="footer-col">
            <h4>Liên hệ</h4>
            <p>Hotline: 0988 888 888</p>
            <p>Email: support@shopao.vn</p>
            <p>Hà Nội, Việt Nam</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 SHOP ÁO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}