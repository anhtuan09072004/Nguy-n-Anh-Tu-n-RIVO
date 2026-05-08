import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/voucher",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // 🔥 QUAN TRỌNG (fix 406)
  },
});

const voucherApi = {
  // ===== GET ALL =====
  getAll: async () => {
    const res = await api.get("");
    return res.data;
  },

  // ===== GET BY ID =====
  getById: async (id) => {
    const res = await api.get(`/${id}`);
    return res.data;
  },

  // ===== CREATE =====
  create: async (data) => {
    const res = await api.post("", data);
    return res.data;
  },

  // ===== UPDATE =====
  update: async (id, data) => {
    const res = await api.put(`/${id}`, data);
    return res.data;
  },

  // ===== DELETE (nếu có) =====
  remove: async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },

  // ===== UPDATE STATUS (🔥 THÊM MỚI) =====
  updateStatus: async (id, data) => {
    const res = await api.put(`/status/${id}`, data);
    return res.data;
  },
};

export default voucherApi;