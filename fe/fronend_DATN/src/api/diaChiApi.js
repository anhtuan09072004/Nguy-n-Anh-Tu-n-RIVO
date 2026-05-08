// import axiosClient from "./axiosClient";

// const diaChiApi = {
//   getByKhachHang: (khId) =>
//     axiosClient.get(`/dia-chi/khach-hang/${khId}`),

//   create: (data) =>
//     axiosClient.post("/dia-chi", data),

//   update: (id, data) =>
//     axiosClient.put(`/dia-chi/${id}`, data),

//   delete: (id) =>
//     axiosClient.delete(`/dia-chi/${id}`),
// };

// export default diaChiApi;

import axios from "axios";

const API = "http://localhost:8080/api/dia-chi";

const diaChiApi = {
  getByCustomer: (id) => axios.get(`${API}/tai-khoan/${id}`),

  create: (data) => axios.post(API, data),

  update: (id, data) => axios.put(`${API}/${id}`, data),

  delete: (id) => axios.delete(`${API}/${id}`),
};

export default diaChiApi;