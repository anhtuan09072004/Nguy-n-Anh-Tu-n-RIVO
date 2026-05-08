import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/vai-tro",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json" // 🔥 FIX CHÍNH
  }
});

const chucVuApi = {
  getAll: async () => {
    const res = await api.get("");
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/${id}`, data);
    return res.data;
  },
};

export default chucVuApi;