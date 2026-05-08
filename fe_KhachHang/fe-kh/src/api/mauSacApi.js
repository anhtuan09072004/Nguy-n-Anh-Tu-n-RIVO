const BASE_URL = "http://localhost:8080/api/client/mau-sac";

const mauSacApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error("Lỗi load màu sắc");
    }

    const data = await res.json();

    // 🔥 handle BE trả object hoặc array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  },
};

export default mauSacApi;