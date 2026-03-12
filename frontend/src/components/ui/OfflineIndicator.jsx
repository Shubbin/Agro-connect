import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg animate-fade-in-up">
      <div className="glass-premium border-destructive/20 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-2xl bg-destructive/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground tracking-tight flex items-center gap-2">
              Connection Lost
              <span className="inline-flex w-2 h-2 rounded-full bg-destructive animate-pulse" />
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Transitioning to offline synchronization...
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-10 h-10 glass-premium rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all active:scale-95"
          title="Attempt Reconnect"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
