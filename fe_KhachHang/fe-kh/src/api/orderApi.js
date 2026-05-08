const BASE_URL = "http://localhost:8080/api/client/orders";

// ================= COMMON FETCH =================
const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    // ❌ lỗi BE trả về
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Có lỗi xảy ra");
    }

    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
};

// ================= GET LIST =================
export const getMyOrders = async (userId) => {
  return request(`${BASE_URL}/my?userId=${userId}`);
};

// ================= GET DETAIL =================
export const getOrderDetail = async (id) => {
  return request(`${BASE_URL}/${id}`);
};