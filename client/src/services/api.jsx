import axios from 'axios';

const API_URL ='http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
  }
};

// User profile endpoints
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Todo endpoints
export const getTodos = async (params = {}) => {
  try {
    const response = await api.get('/todos', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

export const createTodo = async (todoData) => {
  try {
    const response = await api.post('/todos', todoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

export const updateTodo = async (id, updates) => {
  try {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

export const deleteTodo = async (id) => {
  try {
    await api.delete(`/todos/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};

export const toggleTodo = async (id) => {
  try {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle todo');
  }
};

export default api;