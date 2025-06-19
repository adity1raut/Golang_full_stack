import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Todo App
        </Link>
        
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <Link to="/todos" className="text-gray-700 hover:text-primary-600">
                Todos
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-primary-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;