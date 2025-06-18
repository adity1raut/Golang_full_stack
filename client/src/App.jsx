import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodoList from './components/Todo/TodoList';
import TodoForm from './components/Todo/TodoForm';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Loading component
const AppLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <AppLoading />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route wrapper (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <AppLoading />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/todos" replace />;
};

// Main app content
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <AppLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Private routes */}
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      My Todo List
                    </h1>
                    <TodoForm />
                  </div>
                  <TodoList />
                </div>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="*" element={<Navigate to="/todos" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component with providers
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;