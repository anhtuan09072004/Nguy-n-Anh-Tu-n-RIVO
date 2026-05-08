const API = "http://localhost:8080/api/customers";

const customerApi = {
  create: async (data) => {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Đăng ký thất bại");
    }

    return res.json();
  },

  getAll: async () => {
    const res = await fetch(API);
    return res.json();
  },
};

export default customerApi;