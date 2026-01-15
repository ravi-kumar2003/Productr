import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


export const userAPI = {
  register: (data) => API.post("/users/register", data),
  login: (data) => API.post("/users/login", data),
};


export const productAPI = {
  // GET ALL PRODUCTS
  getAll: () => API.get("/products"),

  // CREATE PRODUCT (with images)
  create: (data) =>
    API.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // UPDATE PRODUCT (edit / publish / unpublish)
  update: (id, data) =>
    API.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // DELETE PRODUCT
  delete: (id) => API.delete(`/products/${id}`),
};


export const orderAPI = {
  create: (data) => API.post("/orders", data),
  getAll: () => API.get("/orders"),
};

export default API;
