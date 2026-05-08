import axios from "axios";

const API = "http://localhost:8080/api/thanh-toan";

const thanhToanApi = {
  thanhToan: (data) => axios.post(API, data),
};

export default thanhToanApi;