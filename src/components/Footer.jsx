import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Heart, Twitter, Github as GitHub, Linkedin, Mail } from 'lucide-react';

function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-8 border-t transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-white text-gray-600 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">LinkSnip</span>
            </Link>
            <p className="mb-4 max-w-md">
              Simplify your links with LinkSnip. Our modern URL shortener makes sharing links easier and more effective.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <GitHub size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@linksnip.com" 
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shorten" className="hover:text-primary transition-colors">URL Shortener</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Features</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in 2025
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} LinkSnip. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;