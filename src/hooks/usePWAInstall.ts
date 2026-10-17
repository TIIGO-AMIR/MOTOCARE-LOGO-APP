import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const INSTALLED_STORAGE_KEY = 'moto_log_pwa_installed';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    const stored = localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true';
    return isStandalone || stored;
  });
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateInstalledState = () => {
      const isStandalone =
        mediaQuery.matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      if (isStandalone) {
        setIsInstalled(true);
        localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
      }
    };

    updateInstalledState();
    mediaQuery.addEventListener('change', updateInstalledState);

    const handleBeforeInstallPrompt = (e: Event) => {
      // If already installed, don't show prompt
      if (isInstalled) return;
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setCanInstall(false);
      setShowIOSModal(false);
      localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', updateInstalledState);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const install = async (): Promise<boolean> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          setCanInstall(false);
          localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
          return true;
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
      return false;
    }

    // On iOS Safari, show step-by-step native instruction modal
    if (isIOS && !isInstalled) {
      setShowIOSModal(true);
      return true;
    }

    return false;
  };

  const closeIOSModal = () => setShowIOSModal(false);

  return {
    isInstallable: (!isInstalled) && (canInstall || isIOS),
    isInstalled,
    install,
    isIOS,
    showIOSModal,
    closeIOSModal,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
