import axios from "axios";

const authApi = {
  login: async (data) => {
    const res = await axios.post("http://localhost:8080/auth/login", data);
    return res.data;
  },
};

export default authApi;