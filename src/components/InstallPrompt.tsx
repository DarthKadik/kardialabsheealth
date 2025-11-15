import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('installPromptDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For mobile: show prompt after 3 seconds if event hasn't fired
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: Show instructions for manual install
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let message = 'To install this app:\n\n';
    
    if (isIOS) {
      message += '1. Tap the Share button (square with arrow)\n';
      message += '2. Scroll down and tap "Add to Home Screen"\n';
      message += '3. Tap "Add" in the top right';
    } else if (isAndroid) {
      message += '1. Tap the menu (⋮) in the top right\n';
      message += '2. Tap "Install app" or "Add to Home screen"\n';
      message += '3. Tap "Install"';
    } else {
      message += '1. Click the install icon in your browser\'s address bar\n';
      message += '2. Or use your browser\'s menu to install';
    }

    alert(message);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt || isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-[#3E2723] to-[#5C4033] p-4 rounded-lg shadow-lg border border-[#8B7355]/40 z-50">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-[#FFEBCD] mb-1">Install Sauna Journal</h3>
          <p className="text-sm text-white/80">
            Add to home screen for quick access
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={handleInstall}
          className="bg-[#FFEBCD] text-[#3E2723] hover:bg-[#FFE4B5]"
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>
    </div>
  );
}