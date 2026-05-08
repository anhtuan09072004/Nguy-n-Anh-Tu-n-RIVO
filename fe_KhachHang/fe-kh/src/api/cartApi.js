const BASE_URL = "http://localhost:8080/api/client/cart";

const cartApi = {

  // ➕ thêm giỏ hàng
 add: async (data) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Thêm giỏ hàng thất bại");
  }

  return res.text();
},

  // 🛒 lấy giỏ hàng
  getMyCart: async (userId) => {
    const res = await fetch(`${BASE_URL}?userId=${userId}`);

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR:", text);
      throw new Error("Lấy giỏ hàng thất bại");
    }

    return res.json();
  },

  // 🔥 UPDATE SỐ LƯỢNG
  updateQuantity: async (id, soLuong) => {
    const res = await fetch(
      `${BASE_URL}/update?id=${id}&soLuong=${soLuong}`,
      {
        method: "PUT",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR:", text);
      throw new Error("Cập nhật thất bại");
    }

    return res.text();
  },

  // ❌ XOÁ SẢN PHẨM
  deleteItem: async (id) => {
    const res = await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR:", text);
      throw new Error("Xoá thất bại");
    }

    return res.text();
  },
};

export default cartApi;