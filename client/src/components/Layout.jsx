import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Layout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-gray-600">Made with</span>
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              <span className="text-gray-600">by You</span>
            </div>
            
            <div className="text-center text-gray-500 mb-4 md:mb-0">
              © {currentYear} Todo App. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;