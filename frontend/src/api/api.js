// src/api/api.js

import axios from "axios";

// ✅ Make sure all requests send cookies
axios.defaults.withCredentials = true;

// Base URL for backend
const API_URL = "http://localhost:3000";

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important for cookies
});
// -------------------- Auth --------------------

// Admin login
export const loginAdmin = async (credentials) => {
  // login will set the cookie from backend
  const response = await api.post("/admin/index", credentials);
  return response.data;
};

// Logout (frontend handles token removal if using localStorage)
export const logoutAdmin = async () => {
  await api.post("/admin/logout"); // tell backend to clear cookie
};

// -------------------- Settings --------------------
export const getSettings = async () => {
  const res = await api.get("/admin/settings"); // protected (needs cookie)
  return res.data;
};

export const saveSettings = async ({ website_title, footer_description, website_logo }) => {
  const fd = new FormData();
  fd.append("website_title", website_title);
  fd.append("footer_description", footer_description);
  if (website_logo) fd.append("website_logo", website_logo);

  const res = await api.post("/admin/save-settings", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


// -------------------- Dashboard --------------------
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// -------------------- Users --------------------
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const addUser = async (userData) => {
  const response = await api.post("/admin/add-user", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/update-user/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/delete-user/${id}`);
  return response.data;
};


// -------------------- Categories --------------------
export const getAllCategories = async () => {
  const res = await api.get("/category?frontend=true");
  return res.data.categories || [];
};




export const addCategory = async (data) => {
  const response = await api.post("/admin/add-category", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/update-category/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/delete-category/${id}`);
  return response.data;
};

// -------------------- Articles --------------------
export const getAllArticles = async () => {
  const response = await api.get("/admin/article");
  return response.data;
};

export const addArticle = async (data) => {
  const formData = new FormData();
  for (let key in data) formData.append(key, data[key]);
  const response = await api.post("/admin/add-article", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateArticle = async (id, data) => {
  const formData = new FormData();
  for (let key in data) formData.append(key, data[key]);
  const response = await api.put(`/admin/update-article/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await api.delete(`/admin/delete-article/${id}`);
  return response.data;
};

// -------------------- Comments --------------------
export const getAllComments = async () => {
  const response = await api.get("/admin/comment");
  return response.data;
};

export const updateCommentStatus = async (id, status) => {
  const response = await api.put(`/admin/update-comment-status/${id}`, { status });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await api.delete(`/admin/delete-comment/${id}`);
  return response.data;
};

// -------------------- Frontend Routes --------------------

export const getFrontendSettings = async () => {
  const res = await api.get("/settings"); // public
  return res.data;
};

export const getHomeArticles = async (query = {}) => {
  const response = await api.get("/", { params: query });
  return response.data;
};

export const getArticlesByCategory = async (slug, query = {}) => {
  const response = await api.get(`/category/${slug}`, { params: query });
  return response.data;
};

export const getSingleArticle = async (id) => {
  const response = await api.get(`/single/${id}`);
  return response.data;
};

export const getArticlesByAuthor = async (id, query = {}) => {
  const response = await api.get(`/author/${id}`, { params: query });
  return response.data;
};

export const searchArticles = async (searchQuery, query = {}) => {
  const response = await api.get("/search", { params: { search: searchQuery, ...query } });
  return response.data;
};

export const addComment = async (articleId, commentData) => {
  const response = await api.post(`/single/${articleId}/comment`, commentData);
  return response.data;
};

// Auth Apis
export const signupUser = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};





export default api;
