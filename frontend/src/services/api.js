import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

export const userAPI = {
  register: (data) => API.post("/users/register", data),
  login: (data) => API.post("/users/login", data),
  sendOtp: (data) => API.post("/users/send-otp", data),
  verifyOtp: (data) => API.post("/users/verify-otp", data),
};

export const productAPI = {
  getAll: () => API.get("/products"),

  create: (data) =>
    API.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (data) => API.post("/orders", data),
  getAll: () => API.get("/orders"),
};

export default API;
