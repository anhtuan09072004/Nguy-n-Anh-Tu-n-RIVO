import axios from "axios";

const API = "http://localhost:8080/api/san-pham-chi-tiet";

const sanPhamChiTietApi = {
  // 🔍 lấy tất cả
  getAll: () => axios.get(API),

  // 🔍 search (QUAN TRỌNG)
  search: (keyword) =>
    axios.get(`${API}/search`, {
      params: { keyword },
    }),

  // 📦 theo sản phẩm cha
  getBySanPham: (sanPhamId) => {
    if (!sanPhamId) {
      console.warn("Thiếu sanPhamId");
      return Promise.resolve({ data: [] });
    }
    return axios.get(`${API}/san-pham/${sanPhamId}`);
  },

  // 🔎 chi tiết
  getById: (id) => axios.get(`${API}/${id}`),

  // ➕ tạo
  create: (data) => {
    console.log("CREATE DATA:", data);
    return axios.post(API, data);
  },

  // ✏️ update
  update: (id, data) => {
    console.log("UPDATE DATA:", data);
    return axios.put(`${API}/${id}`, data);
  },

  // ❌ xóa
  delete: (id) => axios.delete(`${API}/${id}`),
};

export default sanPhamChiTietApi;