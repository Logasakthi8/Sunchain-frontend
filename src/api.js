import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const signup = (userData) => api.post('/signup', userData);
export const login = (userData) => api.post('/login', userData);

// Channels
export const createChannel = (formData) => {
  return api.post('/channel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const getChannel = (id) => api.get(`/channel/${id}`);
export const getMyChannel = () => api.get('/channel/my');
export const subscribeToChannel = (channelId) => api.post(`/channel/${channelId}/subscribe`);
export const getUserSubscriptions = () => api.get('/user/subscriptions');
export const getSubscribedChannels = () => api.get('/subscriptions'); // Alternative name

// Posts
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (formData) => {
  return api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const addComment = (id, comment) => api.post(`/posts/${id}/comment`, { text: comment });

// Profile
export const getProfile = () => api.get('/profile');
export const getUserPosts = () => api.get('/user/posts');

export default api;
