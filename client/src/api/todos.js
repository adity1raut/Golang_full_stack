const API_URL = 'http://localhost:8080';

export const getTodos = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/todos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return await response.json();
};

export const createTodo = async (task) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ task }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create todo');
  }

  return await response.json();
};

export const updateTodo = async (id, updates) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update todo');
  }

  return await response.json();
};

export const deleteTodo = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }

  return await response.json();
};