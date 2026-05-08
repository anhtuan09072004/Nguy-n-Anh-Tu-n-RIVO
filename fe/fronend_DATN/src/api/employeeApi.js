import axios from "axios";

const API = "http://localhost:8080/api/employees";

export default {
  getAll: () => axios.get(API),
  create: (data) => axios.post(API, data),
  delete: (id) => axios.delete(`${API}/${id}`),
  update: (id, data) => axios.put(`${API}/${id}`, data),
};