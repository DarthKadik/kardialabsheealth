import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

/**
 * A "smart" install button that provides the best possible action.
 * - If the browser's install prompt is available, it uses it.
 * - If not, it shows manual instructions for the user's OS.
 */
export function InAppInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the browser's install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e); // Stash the event
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // If the browser provided a prompt, use it
    if (installPromptEvent) {
      installPromptEvent.prompt();
    } else {
      // Otherwise, show manual instructions
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

  // Don't show the button if the app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50">
       <Button 
          size="lg" 
          onClick={handleInstallClick}
          className="w-full bg-[#FFEBCD] text-[#3E2723] hover:bg-[#FFE4B5] shadow-lg"
        >
          <Download className="w-5 h-5 mr-3" />
          Install App
        </Button>
    </div>
  );
}
