import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../hooks/useOffline';
import {
  Link as LinkIcon,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  User,
  BarChart2,
  QrCode,
  HomeIcon,
  WifiOff,
} from 'lucide-react';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const isOffline = useOffline();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleMobileNavClick = (path) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 250);
  };

  return (
    <nav
      role="navigation"
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-200 border-b
      ${
        theme === 'dark'
          ? 'bg-transparent shadow-2xl text-white border-gray-800'
          : 'bg-transparent shadow-2xl text-gray-900 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">LinkSnip</span>
            </Link>
            {isOffline && (
              <div className="ml-2 flex items-center text-orange-500 text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                <span>Offline</span>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary font-medium' : ''
              }`}
            >
              Home
            </Link>

            <Link
              to="/shorten"
              className={`transition-colors hover:text-primary ${
                location.pathname === '/shorten'
                  ? 'text-primary font-medium'
                  : ''
              }`}
            >
              Shorten URL
            </Link>
            <Link
              to="/qr"
              className={`transition-colors hover:text-primary ${
                location.pathname === '/qr' ? 'text-primary font-medium' : ''
              }`}
            >
              QrCode
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors hover:text-primary ${
                location.pathname === '/dashboard'
                  ? 'text-primary font-medium'
                  : ''
              }`}
            >
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  } hover:text-primary transition-colors`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`transition-colors hover:text-primary ${
                    location.pathname === '/login'
                      ? 'text-primary font-medium'
                      : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-animate px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 hover:from-lime-500 hover:to-green-600 dark:from-emerald-600 dark:via-green-600 dark:to-lime-500 dark:hover:from-lime-400 dark:hover:to-green-400 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Theme toggle desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu and Overlay */}
      <div
        className={`menu ${
          isMenuOpen ? 'menuOpened' : ''
        } relative w-screen items-end-safe flex justify-self-end `}
      >
        {/* Dark overlay */}
        {isMenuOpen ? (
          <div
            className="fixed w-screen h-screen inset-0 z-10
              opacity-50 bg-black"
            onClick={closeMenu}
            aria-hidden="true"
          />
        ) : (
          ''
        )}

        {/* Slide-in menu */}
        <div
          className={`justify-self-end  relative right-0 h-screen w-72 z-50 ${
            theme === 'dark'
              ? 'bg-gray-900 text-white'
              : 'text-gray-900 bg-white'
          } shadow-xl`}
        >
          <div
            className={`flex justify-end items-center p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
            } z-50`}
          >
            <button
              onClick={closeMenu}
              className={`p-2 rounded ${
                theme === 'dark'
                  ? 'dark:hover:bg-gray-700'
                  : 'hover:bg-gray-200'
              } transition-colors `}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col   px-4 py-3 space-y-2">
            <button
              onClick={() => {
                handleMobileNavClick('/');
              }}
              className={`rounded px-3 py-2 flex items-center space-x-2 ${
                location.pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : `${
                      theme === 'dark'
                        ? 'dark:hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                    }`
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                handleMobileNavClick('/shorten');
              }}
              className={`rounded px-3 py-2 flex items-center space-x-2 ${
                location.pathname === '/shorten'
                  ? 'bg-primary/10 text-primary'
                  : `${
                      theme === 'dark'
                        ? 'dark:hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                    }`
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span>Shorten URL</span>
            </button>
            <button
              onClick={() => {
                handleMobileNavClick('/qr');
              }}
              className={`rounded px-3 py-2 flex items-center space-x-2 ${
                location.pathname === '/qr'
                  ? 'bg-primary/10 text-primary'
                  : `${
                      theme === 'dark'
                        ? 'dark:hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                    }`
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>QrCode</span>
            </button>
            <button
              onClick={() => {
                handleMobileNavClick('/dashboard');
              }}
              className={`rounded px-3 py-2 flex items-center space-x-2 ${
                location.pathname === '/dashboard'
                  ? 'bg-primary/10 text-primary'
                  : `${
                      theme === 'dark'
                        ? 'dark:hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                    }`
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 flex items-center space-x-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleMobileNavClick('/login');
                  }}
                  className={`rounded px-3 py-2 flex items-center space-x-2 ${
                    location.pathname === '/login'
                      ? 'bg-primary/10 text-primary'
                      : `${
                          theme === 'dark'
                            ? 'dark:hover:bg-gray-700'
                            : 'hover:bg-gray-200'
                        }`
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    handleMobileNavClick('/signup');
                  }}
                  className="rounded px-3 py-2 text-white bg-primary hover:bg-primary/90 text-center"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
