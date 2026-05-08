import axios from "axios";

const API = "http://localhost:8080/api/hoa-don";

const hoaDonApi = {
  // hóa đơn
  create: (data) => axios.post(API, data),
  getAll: () => axios.get(API),
  getById: (id) => axios.get(`${API}/${id}`),

  // giỏ hàng
  addProduct: (data) =>
    axios.post("http://localhost:8080/api/hoa-don-chi-tiet", data),

  getCart: (hoaDonId) =>
    axios.get(`http://localhost:8080/api/hoa-don-chi-tiet/${hoaDonId}`),

  decrease: (id) =>
    axios.put(`http://localhost:8080/api/hoa-don-chi-tiet/giam/${id}`),

  removeItem: (id) =>
    axios.delete(`http://localhost:8080/api/hoa-don-chi-tiet/${id}`),

  // thanh toán
  pay: (hoaDonId, tienKhachDua) =>
    axios.post(`${API}/${hoaDonId}/thanh-toan?tienKhachDua=${tienKhachDua}`),

  applyVoucher: (hoaDonId, voucherId) =>
    axios.post(`${API}/${hoaDonId}/voucher?voucherId=${voucherId}`),

   search: (filter) => axios.post(`${API}/search`, filter),
};

export default hoaDonApi;