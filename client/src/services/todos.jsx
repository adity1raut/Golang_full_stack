import api from './api'

class TodoService {
  async getTodos() {
    const response = await api.get('/todos')
    return response.data
  }

  async createTodo(task) {
    const response = await api.post('/todos', { task })
    return response.data
  }

  async updateTodo(id, updates) {
    const response = await api.put(`/todos/${id}`, updates)
    return response.data
  }

  async deleteTodo(id) {
    const response = await api.delete(`/todos/${id}`)
    return response.data
  }
}

export const todoService = new TodoService()