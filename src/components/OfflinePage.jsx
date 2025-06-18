import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../hooks/useOffline';
import { useAuth } from '../context/AuthContext';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflinePage = () => {
  const isOffline = useOffline();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If we come back online, redirect based on authentication status
    if (!isOffline) {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isOffline, isAuthenticated, navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-4xl font-bold mb-2">You're Offline</h1>
          <p className="text-gray-300 mb-6">
            It seems you've lost your internet connection. No worries! Just
            reconnect and refresh to continue using LinkSnip.
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>

        <div className="mt-8 text-sm text-gray-400">
          <p>Some features may be limited while offline</p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
