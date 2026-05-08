const BASE_URL = "http://localhost:8080/api/client/xuat-xu";

const xuatXuApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error("Lỗi load xuất xứ");
    }

    const data = await res.json();

    // 🔥 handle BE trả object hoặc array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  },
};

export default xuatXuApi;