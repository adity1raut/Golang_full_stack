import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} Todo App
        </div>
      </footer>
    </div>
  );
};

export default Layout;