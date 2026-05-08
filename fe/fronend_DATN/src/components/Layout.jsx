import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./img/logoShop.png";

const menu = [
  { name: "Bán hàng", path: "/ban-hang" },
  { name: "Sản phẩm", path: "/san-pham" },
  { name: "Chất liệu", path: "/chat-lieu" },
  { name: "Cổ Áo", path: "/co-ao" },
  { name: "Tay Áo", path: "/tay-ao" },
  { name: "Màu sắc", path: "/mau-sac" },
  { name: "Kích cỡ", path: "/kich-co" },
  { name: "Thương hiệu", path: "/thuong-hieu" },
  { name: "Xuất xứ", path: "/xuat-xu" },
  { name: "Voucher", path: "/voucher" },
  { name: "Khách hàng", path: "/khach-hang" },
  { name: "Nhân viên", path: "/nhan-vien" },
  { name: "Hóa đơn", path: "/hoa-don" },
  { name: "Thống kê", path: "/thong-ke" },
  // { name: "Chức vụ", path: "/chuc-vu" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.vaiTro?.ten || user?.role;

  const employeeAllowedPaths = [
    "/ban-hang",
    "/san-pham",
    "/hoa-don",
    "/thong-ke",
  ];

  const isEmployee = role === "NHANVIEN" || role === "NHAN_VIEN";

  const visibleMenu = isEmployee
    ? menu.filter((item) => employeeAllowedPaths.includes(item.path))
    : menu;

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có chắc muốn đăng xuất không?");
    if (!confirmed) return;

    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-5">
        <img src={logo} alt="SHOP ÁO" className="logo-img mb-4" />

        <ul className="space-y-2">
          {visibleMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-blue-500"
                    : "hover:bg-slate-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="font-semibold text-lg">Bảng điều khiển cửa hàng</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Xin chào, <b>{user?.ten || "Nhân viên"}</b>
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}