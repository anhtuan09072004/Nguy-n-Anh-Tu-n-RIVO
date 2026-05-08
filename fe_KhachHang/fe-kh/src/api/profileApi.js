// src/api/profileApi.js

const BASE_URL = "http://localhost:8080/api/client/me";

const profileApi = {
  // 👉 Lấy thông tin user
  getMyProfile: async () => {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${BASE_URL}?userId=${userId}`);

    if (!res.ok) {
      throw new Error("Lỗi khi lấy thông tin user");
    }

    return res.json();
  },

  // 👉 Cập nhật thông tin user
  updateMyProfile: async (data) => {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${BASE_URL}?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Cập nhật thất bại");
    }

    return res.json();
  },
};

export default profileApi;