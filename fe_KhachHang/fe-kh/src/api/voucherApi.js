// src/api/voucherApi.js

const BASE_URL = "http://localhost:8080/api/voucher";

const voucherApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error("Lỗi load voucher");
    }

    const data = await res.json();

    // 🔥 fix BE trả object
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  },
};

export default voucherApi;