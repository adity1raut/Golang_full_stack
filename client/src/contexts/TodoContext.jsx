import React, { createContext, useContext, useEffect, useState } from 'react'
import { todoService } from '../services/todos'
import { useAuth } from './AuthContext'

const TodoContext = createContext()

export const useTodos = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const fetchTodos = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const todosData = await todoService.getTodos()
      setTodos(todosData)
    } catch (error) {
      setError(error.message)
      console.error('Failed to fetch todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (task) => {
    try {
      setError(null)
      const newTodo = await todoService.createTodo(task)
      setTodos(prev => [newTodo, ...prev])
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const updateTodo = async (id, updates) => {
    try {
      setError(null)
      await todoService.updateTodo(id, updates)
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      ))
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const deleteTodo = async (id) => {
    try {
      setError(null)
      await todoService.deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo.id !== id))
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const toggleTodo = async (id, status) => {
    return updateTodo(id, { status })
  }

  const getStats = () => {
    const total = todos.length
    const completed = todos.filter(todo => todo.status).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, completed, pending, completionRate }
  }

  const value = {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getStats
  }

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  )
}