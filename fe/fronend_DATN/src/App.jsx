import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import ChatLieu from './pages/ChatLieu/ChatLieuPage';
import ChucVu from './pages/ChucVu/index';
import MauSac from "./pages/MauSac/MauSacPage";
import Size from "./pages/KichCo/SizePage";
import ThuongHieu from "./pages/ThuongHieu/ThuongHieuPage";
import XuatXu from "./pages/XuatXu/XuatXuPage";
import CoAo from "./pages/CoAo/CoAoPage";
import TayAo from "./pages/TayAo/TayAoPage";
import Voucher from "./pages/Voucher/VoucherPage";
import SanPham from "./pages/SanPham/SanPhamPage";
import SanPhamChiTiet from "./pages/SanPhamChiTiet/SanPhamChiTietPage";
import BanHang from "./pages/BanHang/Page/PosPage";
import CustomerPage from "./pages/Customer/CustomerPage";
import NhanVien from "./pages/NhanVien/EmployeePage";
import HoaDon from "./pages/QuanLyHoaDon/QuanLyHoaDon";
import QuanLyHoaDonDetail from "./pages/QuanLyHoaDon/QuanLyHoaDonDetail";
import ThongKe from "./pages/ThongKe/ThongKe";

import "antd/dist/reset.css";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<SanPham />} />
                  <Route path="/chat-lieu" element={<ChatLieu />} />
                  <Route path="/mau-sac" element={<MauSac />} />
                  <Route path="/kich-co" element={<Size />} />
                  <Route path="/chuc-vu" element={<ChucVu />} />
                  <Route path="/thuong-hieu" element={<ThuongHieu />} />
                  <Route path="/xuat-xu" element={<XuatXu />} />
                  <Route path="/co-ao" element={<CoAo />} />
                  <Route path="/tay-ao" element={<TayAo />} />
                  <Route path="/voucher" element={<Voucher />} />
                  <Route path="/san-pham" element={<SanPham />} />
                  <Route path="/san-pham/:id/chi-tiet" element={<SanPhamChiTiet />} />
                  <Route path="/ban-hang" element={<BanHang />} />
                  <Route path="/khach-hang" element={<CustomerPage />} />
                  <Route path="/nhan-vien" element={<NhanVien />} />
                  <Route path="/hoa-don" element={<HoaDon />} />
                  <Route path="/admin/hoa-don/:id" element={<QuanLyHoaDonDetail />} />
                  <Route path="/thong-ke" element={<ThongKe />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App