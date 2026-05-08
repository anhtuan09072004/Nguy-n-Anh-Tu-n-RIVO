// import axiosClient from "./axiosClient";

// const hoaDonChiTietApi = {
//   create: (data) =>
//     axiosClient.post("/hoa-don-chi-tiet", data),

//   getByHoaDon: (hoaDonId) =>
//     axiosClient.get(`/hoa-don-chi-tiet/hoa-don/${hoaDonId}`),

//   updateSoLuong: (id, soLuong) =>
//     axiosClient.put(`/hoa-don-chi-tiet/${id}/so-luong`, null, {
//       params: { soLuong },
//     }),

//   increase: (id) =>
//     axiosClient.put(`/hoa-don-chi-tiet/${id}/tang`),

//   decrease: (id) =>
//     axiosClient.put(`/hoa-don-chi-tiet/${id}/giam`),

//   delete: (id) =>
//     axiosClient.delete(`/hoa-don-chi-tiet/${id}`),

//   clearCart: (hoaDonId) =>
//     axiosClient.delete(`/hoa-don-chi-tiet/hoa-don/${hoaDonId}`),
// };

// export default hoaDonChiTietApi;


import axiosClient from "./axiosClient";

const PREFIX = "/api/hoa-don-chi-tiet";

const hoaDonChiTietApi = {
  create: (data) =>
    axiosClient.post(`${PREFIX}`, data),

  getByHoaDon: (hoaDonId) =>
    axiosClient.get(`${PREFIX}/hoa-don/${hoaDonId}`),

  updateSoLuong: (id, soLuong) =>
    axiosClient.put(`${PREFIX}/${id}/so-luong`, null, {
      params: { soLuong },
    }),

  increase: (id) =>
    axiosClient.put(`${PREFIX}/${id}/tang`),

  decrease: (id) =>
    axiosClient.put(`${PREFIX}/${id}/giam`),

  delete: (id) =>
    axiosClient.delete(`${PREFIX}/${id}`),

  clearCart: (hoaDonId) =>
    axiosClient.delete(`${PREFIX}/hoa-don/${hoaDonId}`),
};

export default hoaDonChiTietApi;