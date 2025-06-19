const API_URL = 'http://localhost:8080';

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return await response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  localStorage.removeItem('token');
  return await response.json();
};