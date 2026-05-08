// src/api/diaChiApi.js

const BASE_URL = "http://localhost:8080/api/client/address";

// 👉 lấy userId từ localStorage
const getUserId = () => localStorage.getItem("userId");

const diaChiApi = {
  // ================= GET =================
  getMyAddresses: async () => {
    const res = await fetch(
      `${BASE_URL}/my-addresses?userId=${getUserId()}`
    );

    if (!res.ok) {
      throw new Error("Lỗi load địa chỉ");
    }

    return res.json();
  },

  // ================= CREATE =================
  createAddress: async (data) => {
    const res = await fetch(
      `${BASE_URL}?userId=${getUserId()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Thêm địa chỉ thất bại");
    }

    return res.json();
  },

  // ================= UPDATE =================
  updateAddress: async (id, data) => {
    const res = await fetch(
      `${BASE_URL}/${id}?userId=${getUserId()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Cập nhật thất bại");
    }

    return res.json();
  },

  // ================= DELETE =================
  deleteAddress: async (id) => {
    const res = await fetch(
      `${BASE_URL}/${id}?userId=${getUserId()}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Xóa thất bại");
    }
  },
};

export default diaChiApi;