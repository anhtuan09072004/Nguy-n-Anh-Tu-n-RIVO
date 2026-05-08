
import "./App.css";
import Layout from "./component/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./page/Home/Home";
import SanPham from "./page/SanPham/SanPham";
import LienHe from "./page/TaiKhoan/TaiKhoan";
import SanPhamDetail from "./page/SanPhamChiTiet/SanPhamDetail";
import Login from "./page/auth/Login";
import ProtectedRoute from "./page/auth/ProtectedRoute";
import Register from "./page/auth/Register";
import GioHang from "./page/GioHang/GioHang";
import Checkout from "./page/GioHang/Checkout";
import Success from "./page/GioHang/Success";

import Orders from "./page/Order/Orders";
import OrderDetail from "./page/Order/OrderDetail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTE */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/san-pham"
          element={
            <ProtectedRoute>
              <Layout>
                <SanPham />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tai-khoan"
          element={
            <ProtectedRoute>
              <Layout>
                <LienHe />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/san-pham/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SanPhamDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gio-hang"
          element={
            <ProtectedRoute>
              <Layout>
                <GioHang />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Layout>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          }
        />

         <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Layout>
                <Success />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <OrderDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
