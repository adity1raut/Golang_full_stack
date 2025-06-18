import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.setToken(token)
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      localStorage.removeItem('token')
      authService.setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      setError(null)
      const { token } = await authService.login(username, password)
      localStorage.setItem('token', token)
      authService.setToken(token)
      await fetchProfile()
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      await authService.register(userData)
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      authService.setToken(null)
      setUser(null)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      await authService.updateProfile(profileData)
      await fetchProfile()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile: fetchProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}