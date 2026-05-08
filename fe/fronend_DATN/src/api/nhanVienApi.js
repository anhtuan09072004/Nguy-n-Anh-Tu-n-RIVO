import axiosClient from "./axiosClient";

const nhanVienApi = {
  getAll: () => axiosClient.get("/nhan-vien"),
  create: (data) => axiosClient.post("/nhan-vien", data),
  update: (id, data) => axiosClient.put(`/nhan-vien/${id}`, data),
  delete: (id) => axiosClient.delete(`/nhan-vien/${id}`),
};

export default nhanVienApi;