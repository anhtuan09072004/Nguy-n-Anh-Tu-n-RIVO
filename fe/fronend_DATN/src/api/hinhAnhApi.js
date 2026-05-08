// import axios from "axios";

// const API = "http://localhost:8080/api/hinh-anh";

// const hinhAnhApi = {
//   // ✅ Lấy ảnh theo sản phẩm chi tiết
//   getBySPCT: async (id) => {
//     try {
//       const res = await axios.get(`${API}/san-pham-chi-tiet/${id}`);
//       return res.data;
//     } catch (error) {
//       console.error("Lỗi getBySPCT:", error);
//       throw error;
//     }
//   },

//   // ✅ Upload ảnh
//   upload: async (file, sanPhamChiTietId, isMain = false) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("sanPhamChiTietId", sanPhamChiTietId);
//       formData.append("isMain", isMain);

//       console.log("UPLOAD DATA:", {
//         fileName: file?.name,
//         sanPhamChiTietId,
//         isMain,
//       });

//       const res = await axios.post(`${API}/upload`, formData);
//       return res.data;
//     } catch (error) {
//       console.error("Lỗi upload:", error);
//       throw error;
//     }
//   },

//   // ✅ Xóa ảnh (soft delete)
//   delete: async (id) => {
//     try {
//       const res = await axios.delete(`${API}/${id}`);
//       return res.data;
//     } catch (error) {
//       console.error("Lỗi delete:", error);
//       throw error;
//     }
//   },
// };

// export default hinhAnhApi;



import axios from "axios";

const BASE_URL = "http://localhost:8080/api/hinh-anh";

const hinhAnhApi = {
  getBySPCT: (spctId) =>
    axios.get(`${BASE_URL}/spct/${spctId}`),

  create: (data) =>
    axios.post(BASE_URL, data),

  delete: (id) =>
    axios.delete(`${BASE_URL}/${id}`)
};

export default hinhAnhApi;