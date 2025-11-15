import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

/**
 * This component implements the custom in-app installation flow
 * as described in the web.dev article: https://web.dev/articles/customize-install
 */
export function InAppInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser prompt from showing
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e);
      // Show our custom install button
      setShowInstallButton(true);
    };

    // Listen for the browser's signal that the app can be installed
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for when the app is successfully installed
    const handleAppInstalled = () => {
      // Hide the custom install button once installed
      setShowInstallButton(false);
      setInstallPromptEvent(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    // Trigger the browser's installation prompt
    installPromptEvent.prompt();
    
    // The prompt can only be used once
    setInstallPromptEvent(null);
    setShowInstallButton(false);
  };

  // Only render the button if the browser has indicated the app is installable
  if (!showInstallButton) {
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
          Install App to Your Device
        </Button>
    </div>
  );
}
