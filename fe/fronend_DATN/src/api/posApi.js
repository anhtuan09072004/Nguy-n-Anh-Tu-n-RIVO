import axios from "./axiosClient";

const API = "/api/ban-hang";

const posApi = {
  // 🔥 TẠO HÓA ĐƠN
  createHoaDon: (data = {}) => axios.post(`${API}/hoa-don`, data),

  // 🔥 LẤY DANH SÁCH HÓA ĐƠN
  getAllHoaDon: () => axios.get(`${API}/hoa-don`),

  // 🔥 LẤY CHI TIẾT HÓA ĐƠN
  getHoaDonChiTiet: (id) => axios.get(`${API}/${id}`),

  // 🔥 THÊM SẢN PHẨM
  addSanPham: (data) => axios.post(`${API}/them-san-pham`, data),

  // 🔥 UPDATE SỐ LƯỢNG
  updateSoLuong: (data) => axios.put(`${API}/update-so-luong`, data),

  // 🔥 XOÁ ITEM
  deleteItem: (id) => axios.delete(`${API}/xoa/${id}`),

  // 🔥 VOUCHER
  applyVoucher: (data) => axios.post(`${API}/voucher`, data),

  // 🔥 THANH TOÁN
  thanhToan: (data) => axios.post("/api/thanh-toan", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }),
};

export default posApi;