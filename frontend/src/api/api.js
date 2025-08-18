// frontend/src/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // your backend URL

// Create an Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // to send cookies for auth
});

// ------------------- Auth & Admin -------------------

// Login
// Login
export const adminLogin = async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
};


// Logout
export const adminLogout = async () => {
    const response = await api.get('/admin/logout');
    return response.data;
};

// Get Dashboard Data
export const getDashboard = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

// ------------------- Users -------------------

// Get all users
export const fetchUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

// Add user
export const addUser = async (userData) => {
    const response = await api.post('/admin/add-user', userData);
    return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
    const response = await api.post(`/admin/update-user/${id}`, userData);
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await api.delete(`/admin/delete-user/${id}`);
    return response.data;
};

// ------------------- Categories -------------------

export const fetchCategories = async () => {
    const response = await api.get('/admin/category');
    return response.data;
};

export const addCategory = async (categoryData) => {
    const response = await api.post('/admin/add-category', categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await api.post(`/admin/update-category/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/admin/delete-category/${id}`);
    return response.data;
};

// ------------------- Articles -------------------

export const fetchArticles = async () => {
    const response = await api.get('/admin/article');
    return response.data;
};

export const addArticle = async (formData) => {
    const response = await api.post('/admin/add-article', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateArticle = async (id, formData) => {
    const response = await api.post(`/admin/update-article/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteArticle = async (id) => {
    const response = await api.delete(`/admin/delete-article/${id}`);
    return response.data;
};

// ------------------- Comments -------------------

export const fetchComments = async () => {
    const response = await api.get('/admin/comment');
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

// ------------------- Settings -------------------

export const fetchSettings = async () => {
    const response = await api.get('/admin/settings');
    return response.data;
};

export const saveSettings = async (formData) => {
    const response = await api.post('/admin/save-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ------------------- Frontend -------------------

// Get homepage articles
export const getArticles = async (query = {}) => {
    const response = await api.get('/', { params: query });
    return response.data;
};

// Get articles by category
export const getArticlesByCategory = async (slug, query = {}) => {
    const response = await api.get(`/category/${slug}`, { params: query });
    return response.data;
};

// Get single article
export const getSingleArticle = async (id) => {
    const response = await api.get(`/single/${id}`);
    return response.data;
};

// Search
export const searchArticles = async (searchQuery, query = {}) => {
    const response = await api.get('/search', {
        params: { search: searchQuery, ...query },
    });
    return response.data;
};

// Author articles
export const getAuthorArticles = async (id, query = {}) => {
    const response = await api.get(`/author/${id}`, { params: query });
    return response.data;
};

// Add comment
export const addComment = async (articleId, commentData) => {
    const response = await api.post(`/single/${articleId}/comment`, commentData);
    return response.data;
};

export default api;
