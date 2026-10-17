import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Network status"
      className="bg-amber-700 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b border-amber-800 shadow-sm"
    >
      <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
      <span>Offline Mode Active — All motorcycle records and expenditure calculations are safely preserved locally.</span>
    </aside>
  );
};
