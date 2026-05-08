import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/tay-ao",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json" 
  }
});

const tayAoApi = {
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

export default tayAoApi;