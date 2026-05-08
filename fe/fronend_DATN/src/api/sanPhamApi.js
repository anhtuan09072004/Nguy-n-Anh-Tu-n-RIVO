import axios from "axios";

const API = "http://localhost:8080/api/san-pham";

const sanPhamApi = {
  getAll: () => axios.get(API).then(res => res.data),

  getById: (id) => axios.get(`${API}/${id}`).then(res => res.data),

  create: (data) => axios.post(API, data).then(res => res.data),

  update: (id, data) =>
    axios.put(`${API}/${id}`, data).then(res => res.data),

  delete: (id) =>
    axios.delete(`${API}/${id}`).then(res => res.data),
};

export default sanPhamApi;