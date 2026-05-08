const API = "http://localhost:8080/api/client/auth";

const authApi = {
  login: async (data) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    return res.json();
  },
};

export default authApi;