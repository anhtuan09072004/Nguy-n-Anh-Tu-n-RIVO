const API = "http://localhost:8080/api/thong-ke";

const thongKeApi = {
  // ===== hôm nay =====
  homNay: async () => {
    const res = await fetch(`${API}/today`);
    return res.json();
  },

  // ===== theo khoảng =====
  theoKhoang: async (data) => {
    const res = await fetch(`${API}/range`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  // ===== top bán chạy =====
  topBanChay: async () => {
    const res = await fetch(`${API}/top-ban-chay`);
    return res.json();
  },

  // ===== top sắp hết =====
  topSapHet: async () => {
    const res = await fetch(`${API}/top-sap-het`);
    return res.json();
  },
};

export default thongKeApi;