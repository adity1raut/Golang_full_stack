const API_URL = 'http://localhost:8080';

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return await response.json();
};