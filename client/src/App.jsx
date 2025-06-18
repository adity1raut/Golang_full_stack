import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" /> : <Register />
          } />
          <Route path="/" element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          <Route path="/dashboard" element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            user ? (
              <Layout>
                <Profile />
              </Layout>
            ) : <Navigate to="/login" />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App