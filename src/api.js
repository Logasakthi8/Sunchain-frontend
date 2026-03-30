import axios from 'axios';

const API_URL = 'https://sunchain-backend1-2.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signup = (userData) => api.post('/signup', userData);
export const login = (userData) => api.post('/login', userData);
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (formData) => api.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const addComment = (id, comment) => api.post(`/posts/${id}/comment`, { text: comment });
export const getUserPosts = () => api.get('/user/posts');
export const getProfile = () => api.get('/user/profile');

export default api;
