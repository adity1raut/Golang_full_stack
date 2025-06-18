import api from './api'

class AuthService {
  constructor() {
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async login(username, password) {
    const response = await api.post('/login', { username, password })
    return response.data
  }

  async register(userData) {
    const response = await api.post('/register', userData)
    return response.data
  }

  async logout() {
    const response = await api.post('/logout')
    return response.data
  }

  async getProfile() {
    const response = await api.get('/profile')
    return response.data
  }

  async updateProfile(profileData) {
    const response = await api.put('/profile', profileData)
    return response.data
  }

  async checkHealth() {
    const response = await api.get('/health')
    return response.data
  }
}

export const authService = new AuthService()