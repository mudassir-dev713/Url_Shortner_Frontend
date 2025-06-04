import { lazy, Suspense, useEffect, useRef } from 'react';
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ShortenerPage = lazy(() => import('./pages/ShortenerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));

const Layout = lazy(() => import('./components/Layout'));

import { DelayedFallbackLoader } from './components/DelayFallback';
import { PublicRoute } from './components/ProtectedRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import QrCodePage from './pages/QrCodePage';

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const navigationType = useNavigationType(); // Optional: for handling popstate

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

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-[#dadada8f] text-gray-900'
      }`}
    >
      <Suspense fallback={<DelayedFallbackLoader />}>
        <>
          <Routes location={location}>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route path="shorten" element={<ShortenerPage />} />
              <Route path="qr" element={<QrCodePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route
                path="analytics/:id"
                element={
                  <ProtectedRoute>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </>
      </Suspense>
    </div>
  );
}

export default App;
