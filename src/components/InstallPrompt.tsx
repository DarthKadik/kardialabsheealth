import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the browser's install prompt.
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt.
    await deferredPrompt.userChoice;
    // Clear the deferredPrompt so it can be garbage collected.
    setDeferredPrompt(null);
  };

  const handleDismissClick = () => {
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-[#3E2723] to-[#5C4033] p-4 rounded-lg shadow-lg border border-[#8B7355]/40 z-50">
      <button 
        onClick={handleDismissClick}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-[#FFEBCD] mb-1">Install Sauna Journal</h3>
          <p className="text-sm text-white/80">
            Add to home screen for quick access.
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={handleInstallClick}
          className="bg-[#FFEBCD] text-[#3E2723] hover:bg-[#FFE4B5]"
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>
    </div>
  );
}