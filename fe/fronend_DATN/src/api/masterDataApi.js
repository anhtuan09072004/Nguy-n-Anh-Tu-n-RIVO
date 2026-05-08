// import axios from "axios";

// export default {
//   getKieuDang: () => axios.get("http://localhost:8080/api/kieu-dang"),
//   getChatLieu: () => axios.get("http://localhost:8080/api/chat-lieu"),
//   getNCC: () => axios.get("http://localhost:8080/api/nha-cung-cap"),
//   getMauSac: () => axios.get("http://localhost:8080/api/mau-sac"),
//   getKichThuoc: () => axios.get("http://localhost:8080/api/size"),
// };


import axiosClient from "./axiosClient";

export default {
  getKieuDang: () => axiosClient.get("/kieu-dang"),
  getChatLieu: () => axiosClient.get("/chat-lieu"),
  getNCC: () => axiosClient.get("/nha-cung-cap"),
  getMauSac: () => axiosClient.get("/mau-sac"),
  getSize: () => axiosClient.get("/size"), // 🔥 THÊM CHUẨN
};