

export const API_BASE_URL = 'http://localhost:8080';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  HOME: '/'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  TODOS: {
    BASE: '/todos',
    BY_ID: (id) => `/todos/${id}`,
    TOGGLE: (id) => `/todos/${id}/toggle`
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile'
  }
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
};

export const TODO_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const TODO_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const PRIORITY_COLORS = {
  [TODO_PRIORITIES.LOW]: 'bg-green-100 text-green-800',
  [TODO_PRIORITIES.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TODO_PRIORITIES.HIGH]: 'bg-red-100 text-red-800'
};

export const PRIORITY_LABELS = {
  [TODO_PRIORITIES.LOW]: 'Low',
  [TODO_PRIORITIES.MEDIUM]: 'Medium',
  [TODO_PRIORITIES.HIGH]: 'High'
};

export const STATUS_COLORS = {
  [TODO_STATUSES.PENDING]: 'bg-gray-100 text-gray-800',
  [TODO_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TODO_STATUSES.COMPLETED]: 'bg-green-100 text-green-800'
};

export const STATUS_LABELS = {
  [TODO_STATUSES.PENDING]: 'Pending',
  [TODO_STATUSES.IN_PROGRESS]: 'In Progress',
  [TODO_STATUSES.COMPLETED]: 'Completed'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  TITLE_MIN_LENGTH: 'Title must be at least 3 characters long',
  TITLE_MAX_LENGTH: 'Title must not exceed 100 characters'
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10
};

export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4'
};