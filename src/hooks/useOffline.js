import { useState, useEffect } from 'react';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    let timeoutId;

    const handleOnline = () => {
      // Clear any pending offline state
      clearTimeout(timeoutId);
      setIsOffline(false);
    };

    const handleOffline = () => {
      // Add a small delay to prevent false positives
      timeoutId = setTimeout(() => {
        setIsOffline(true);
      }, 1000);
    };

    // Test network connectivity
    const testConnection = async () => {
      try {
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        if (!response.ok) {
          handleOffline();
        } else {
          handleOnline();
        }
      } catch (error) {
        handleOffline();
      }
    };

    // Initial connection test
    testConnection();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test connection periodically
    const intervalId = setInterval(testConnection, 30000); // Every 30 seconds

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};
