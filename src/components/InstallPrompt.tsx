import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Install Sauna Journal</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add to home screen for quick access
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPrompt(false)}>
            Later
          </Button>
          <Button size="sm" onClick={handleInstall}>
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}