const BASE_URL = "http://localhost:8080/api/client";
const PAYMENT_URL = "http://localhost:8080/api/payment";

const checkoutApi = {
  // ================= CHECKOUT =================
  checkout: async (data) => {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("CHECKOUT RESPONSE:", text);

  if (!res.ok) {
    throw new Error(text || "Lỗi checkout");
  }

  return text ? JSON.parse(text) : null;
},

  // ================= VNPAY =================
  createVnpay: async (userId, data) => {
    const res = await fetch(`${PAYMENT_URL}/vnpay/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Lỗi tạo thanh toán VNPay");
    }

    return res.json();
  },

  // ================= APPLY VOUCHER =================
  applyVoucher: async (code, total) => {
    const res = await fetch(
      `${BASE_URL}/voucher/apply?code=${code}&total=${total}`
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Voucher không hợp lệ");
    }

    return res.json();
  },
};

export default checkoutApi;