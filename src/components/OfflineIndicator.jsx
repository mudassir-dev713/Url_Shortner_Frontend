import React, { useState } from 'react';
import { useOffline } from '../hooks/useOffline';
import { WifiOff, X } from 'lucide-react';

const OfflineIndicator = () => {
  const isOffline = useOffline();
  const [isVisible, setIsVisible] = useState(false);

  // Show indicator after a short delay when offline
  React.useEffect(() => {
    let timeoutId;

    if (isOffline) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOffline]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-2 z-50 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">
          You're currently offline. Some features may be limited.
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-orange-100 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default OfflineIndicator;
