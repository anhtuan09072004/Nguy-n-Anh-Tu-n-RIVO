import axios from "axios";

const API = "http://localhost:8080/api/quan-ly-hoa-don";

const quanLyHoaDonApi = {
  search: (data) => axios.post(`${API}/search`, data),

  getDetail: (id) => axios.get(`${API}/${id}`),

  updateStatus: (id, trangThai) =>
    axios.put(`${API}/${id}/trang-thai?trangThai=${trangThai}`),

  cancel: (id) => axios.delete(`${API}/${id}`),
};

export default quanLyHoaDonApi;