const BASE_URL = "http://localhost:8080/api/client/san-pham";

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json();
};

const sanPhamApi = {

  // ❌ API này bạn đang comment ở BE -> gọi sẽ lỗi 404
  // getAll: async () => {
  //   const res = await fetch(BASE_URL);
  //   return handleResponse(res);
  // },

  // ✔ Lấy chi tiết
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return handleResponse(res);
  },

  // ✔ Filter
  filter: async ({ keyword, thuongHieuId, xuatXuId }) => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (thuongHieuId) params.append("thuongHieuId", thuongHieuId);
    if (xuatXuId) params.append("xuatXuId", xuatXuId);

    const res = await fetch(`${BASE_URL}/filter?${params.toString()}`);
    return handleResponse(res);
  },

  // 🔥 TOP BÁN CHẠY (đã khớp controller)
  getTopBanChay: async () => {
    const res = await fetch(`${BASE_URL}/top-ban-chay`);
    return handleResponse(res);
  }

};

export default sanPhamApi;