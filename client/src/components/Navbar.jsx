import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { 
  Home, 
  ListTodo, 
  User, 
  LogIn, 
  LogOut, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Nav */}
        <div className="hidden md:flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Todo App</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {token ? (
              <>
                <Link 
                  to="/todos" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ListTodo className="h-4 w-4" />
                  <span>Todos</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600"
          >
            <Home className="h-5 w-5" />
            <span>Todo App</span>
          </Link>

          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-primary-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {token ? (
              <>
                <Link 
                  to="/todos" 
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListTodo className="h-4 w-4" />
                  <span>Todos</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;