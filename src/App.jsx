import { lazy, Suspense, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
// const HomePage = lazy(() => import('./pages/HomePage'));
import HomePage from './pages/HomePage';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ShortenerPage = lazy(() => import('./pages/ShortenerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));

import Layout from './components/Layout';

import { PublicRoute } from './components/ProtectedRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import QrCodePage from './pages/QrCodePage';
import { useAuth } from './context/AuthContext';
import { ThemeColorUpdater } from './components/ThemeColorUpdater';
import lazyWithPreload from 'react-lazy-with-preload';
import Loader from './components/Loader';
function App() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      location.pathname !== previousPathRef.current &&
      document.startViewTransition
    ) {
      document.startViewTransition(() => {
        previousPathRef.current = location.pathname;
      });
    }
  }, [location]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, []);

  useEffect(() => {
    lazyWithPreload(() => import('./pages/DashboardPage'));
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-[#dadada8f] text-gray-900'
      }`}
    >
      <ThemeColorUpdater />
      <Routes location={location}>
        <Route path="/" element={<Layout />}>
          {/* Render HomePage directly */}
          <Route index element={<HomePage />} />

          {/* Wrap lazy routes only inside Suspense */}
          <Route
            path="login"
            element={
              <Suspense fallback={<Loader />}>
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              </Suspense>
            }
          />
          <Route
            path="signup"
            element={
              <Suspense fallback={<Loader />}>
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              </Suspense>
            }
          />
          <Route
            path="shorten"
            element={
              <Suspense fallback={<Loader />}>
                <ShortenerPage />
              </Suspense>
            }
          />
          <Route path="qr" element={<QrCodePage />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="analytics/:id"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<Loader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
