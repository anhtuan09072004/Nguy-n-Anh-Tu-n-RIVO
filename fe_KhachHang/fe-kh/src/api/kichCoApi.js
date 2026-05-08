const BASE_URL = "http://localhost:8080/api/client/kich-co";

const kichCoApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error("Lỗi load kích cỡ");
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  },
};

export default kichCoApi;