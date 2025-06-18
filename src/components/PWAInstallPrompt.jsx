import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
  const { isAuthenticated } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);

      // Check if user has dismissed the prompt recently
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
      const lastShown = localStorage.getItem('pwa-prompt-last-shown');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Don't show if dismissed within last 7 days
      if (lastDismissed && now - parseInt(lastDismissed) < oneDay * 7) {
        return;
      }

      // Don't show if shown within last 3 days
      if (lastShown && now - parseInt(lastShown) < oneDay * 3) {
        return;
      }

      // Show install prompt based on authentication status
      if (!isAuthenticated) {
        // Show every time for non-logged-in users (if not recently dismissed)
        setShowInstallPrompt(true);
        localStorage.setItem('pwa-prompt-last-shown', now.toString());
      } else {
        // Show occasionally for logged-in users (20% chance)
        const shouldShow = Math.random() < 0.2;
        if (shouldShow) {
          setShowInstallPrompt(true);
          localStorage.setItem('pwa-prompt-last-shown', now.toString());
        }
      }
    };

    const handleAppInstalled = () => {
      // Hide the install prompt
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      // Mark as installed to prevent future prompts
      localStorage.setItem('pwa-installed', 'true');
      console.log('PWA was installed');
    };

    // Check if already installed
    const isInstalled = localStorage.getItem('pwa-installed');
    if (isInstalled) {
      return;
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isAuthenticated]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
    // Mark as dismissed for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Download className="h-5 w-5 text-green-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install LinkSnip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Add to home screen for quick access
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-sm transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
