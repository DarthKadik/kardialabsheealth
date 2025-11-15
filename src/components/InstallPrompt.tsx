import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

// --- PWA Diagnostic Component ---

export function InstallPrompt() {
  const [pwaStatus, setPwaStatus] = useState<'pending' | 'ready' | 'not-supported' | 'installed'>('pending');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaStatus('installed');
      return;
    }

    // 2. Listen for the browser's install prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaStatus('ready'); // The browser says we are ready to install!
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 3. If the event doesn't fire after a few seconds, assume it's not supported
    const timer = setTimeout(() => {
      if (pwaStatus === 'pending') {
        setPwaStatus('not-supported');
      }
    }, 5000); // Wait 5 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [pwaStatus]);

  const handleInstallClick = () => {
    if (pwaStatus === 'ready' && deferredPrompt) {
      deferredPrompt.prompt(); // Show the native install prompt
    } else {
      // Fallback for iOS and browsers that didn't fire the event
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    alert(
      isIOS
        ? 'To install: Tap the Share button, then scroll down and select "Add to Home Screen".'
        : 'To install: Open your browser menu (the three dots) and look for "Install app" or "Add to Home screen".'
    );
  };

  // Don't show anything if the app is already installed
  if (pwaStatus === 'installed') {
    return null;
  }

  // Render the diagnostic UI
  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 z-50 text-white">
      <h3 className="font-semibold text-center mb-3">PWA Install Status</h3>
      
      <div className="flex items-center justify-center gap-2 mb-4">
        {pwaStatus === 'pending' && <><AlertCircle className="w-4 h-4 text-yellow-400" /><span>Checking...</span></>}
        {pwaStatus === 'ready' && <><CheckCircle className="w-4 h-4 text-green-400" /><span>Ready to Install!</span></>}
        {pwaStatus === 'not-supported' && <><AlertCircle className="w-4 h-4 text-red-400" /><span>Automatic prompt not available.</span></>}
      </div>

      <Button 
        onClick={handleInstallClick}
        className="w-full bg-[#FFEBCD] text-[#3E2723] hover:bg-[#FFE4B5]"
      >
        <Download className="w-4 h-4 mr-2" />
        {pwaStatus === 'ready' ? 'Install App' : 'Show Install Instructions'}
      </Button>
    </div>
  );
}