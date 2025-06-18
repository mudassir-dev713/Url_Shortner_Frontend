import { lazy, Suspense, useEffect, useRef, useState } from 'react';
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
import OfflinePage from './components/OfflinePage';
import OfflineIndicator from './components/OfflineIndicator';
import PWAInstallPrompt from './components/PWAInstallPrompt';

import { PublicRoute } from './components/ProtectedRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import QrCodePage from './pages/QrCodePage';
import { useAuth } from './context/AuthContext';
import { ThemeColorUpdater } from './components/ThemeColorUpdater';
import { useOffline } from './hooks/useOffline';
// import lazyWithPreload from 'react-lazy-with-preload';
import Loader from './components/Loader';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isOffline = useOffline();
  const [showOfflinePage, setShowOfflinePage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
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
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  // Handle offline state with delay to prevent false positives
  useEffect(() => {
    let timeoutId;

    if (isOffline) {
      setWasOffline(true);
      // Show offline page after 5 seconds of being offline (longer delay)
      timeoutId = setTimeout(() => {
        setShowOfflinePage(true);
      }, 5000);
    } else {
      setShowOfflinePage(false);

      // If we were offline and now we're back online, handle redirect
      if (wasOffline) {
        setWasOffline(false);
        // Redirect based on authentication status
        if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOffline, isAuthenticated, wasOffline, navigate]);

  // Show offline page when offline for extended period
  if (showOfflinePage) {
    return <OfflinePage />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-[#dadada8f] text-gray-900'
      }`}
    >
      <ThemeColorUpdater />

      {/* Offline Indicator - shows subtle banner when offline */}
      <OfflineIndicator />

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

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
