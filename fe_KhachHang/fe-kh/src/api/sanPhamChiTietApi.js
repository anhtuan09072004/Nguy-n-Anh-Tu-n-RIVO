const BASE_URL = "http://localhost:8080/api/client/san-pham-chi-tiet";

const sanPhamChiTietApi = {

  // 🔥 Lấy tất cả biến thể của 1 sản phẩm (QUAN TRỌNG NHẤT)
  getBySanPhamId: async (sanPhamId) => {
    console.log("🔥 CALL API SPCT:", sanPhamId);

    const res = await fetch(`${BASE_URL}/san-pham/${sanPhamId}`);

    if (!res.ok) {
      console.error("❌ API ERROR:", res.status);
      throw new Error("Lỗi khi lấy biến thể sản phẩm");
    }

    const data = await res.json();

    console.log("✅ DATA SPCT:", data);

    return data;
  },

  // 🔥 Lấy chi tiết 1 biến thể (nếu cần)
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return res.json();
  },

};

export default sanPhamChiTietApi;