import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

// Optional: interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// User APIs
export const userAPI = {
  register: (data) => API.post("/users/register", data),
  login: (data) => API.post("/users/login", data),
  sendOtp: (data) => API.post("/users/send-otp", data),
  verifyOtp: (data) => API.post("/users/verify-otp", data),
};

// Product APIs
export const productAPI = {
  getAll: () => API.get("/products"),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) =>
    API.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => API.post("/orders", data),
  getAll: () => API.get("/orders"),
};

export default API;
