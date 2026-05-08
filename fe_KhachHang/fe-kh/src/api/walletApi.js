const BASE_URL = "http://localhost:8080/api/wallet";

const walletApi = {

  // 🟢 Nạp tiền
  napTien: async (userId, amount) => {
    const res = await fetch(`${BASE_URL}/nap-tien`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        amount: amount,
      }),
    });

    if (!res.ok) throw new Error("Nạp tiền thất bại");
    return res.text(); // BE trả string
  },

  // 🟢 Lấy số dư
  getSoDu: async (userId) => {
    const res = await fetch(`${BASE_URL}/so-du/${userId}`);
    if (!res.ok) throw new Error("Lỗi lấy số dư");
    return res.json(); // BigDecimal
  },

  // 🟢 Lịch sử giao dịch
  getLichSu: async (userId) => {
    const res = await fetch(`${BASE_URL}/lich-su/${userId}`);
    if (!res.ok) throw new Error("Lỗi lấy lịch sử");
    return res.json(); // List<GiaoDich>
  },

  // 🟢 Kiểm tra số dư
  kiemTraSoDu: async (userId, soTien) => {
    const res = await fetch(`${BASE_URL}/kiem-tra-so-du`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        soTien: soTien,
      }),
    });

    if (!res.ok) throw new Error("Lỗi kiểm tra số dư");
    return res.json(); // true/false
  },
};

export default walletApi;