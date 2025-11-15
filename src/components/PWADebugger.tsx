import { useEffect, useState } from 'react';

export function PWADebugger() {
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    const checks: string[] = [];

    // 1. Check if running on HTTPS
    checks.push(`🔒 HTTPS: ${window.location.protocol === 'https:' ? '✅' : '❌'}`);

    // 2. Check if service worker is supported
    checks.push(`👷 SW Support: ${'serviceWorker' in navigator ? '✅' : '❌'}`);

    // 3. Check if manifest exists
    const manifestLink = document.querySelector('link[rel="manifest"]');
    checks.push(`📄 Manifest Link: ${manifestLink ? '✅' : '❌'}`);

    // 4. Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    checks.push(`📱 Already Installed: ${isInstalled ? '✅' : '❌'}`);

    // 5. Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        const swStatus = reg ? '✅ Active' : '❌ Not registered';
        setStatus(prev => [...prev, `🔧 SW Status: ${swStatus}`]);
      });
    }

    // 6. Listen for beforeinstallprompt
    let promptReceived = false;
    const handler = () => {
      promptReceived = true;
      setStatus(prev => [...prev, '🎉 Install Prompt Event: ✅ RECEIVED']);
    };
    window.addEventListener('beforeinstallprompt', handler);

    setTimeout(() => {
      if (!promptReceived) {
        setStatus(prev => [...prev, '❌ Install Prompt Event: NOT RECEIVED after 5s']);
      }
    }, 5000);

    setStatus(checks);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white p-4 text-xs font-mono z-[9999] max-h-[40vh] overflow-auto">
      <div className="max-w-md mx-auto">
        <h3 className="font-bold mb-2">PWA Debug Info:</h3>
        {status.map((s, i) => (
          <div key={i} className="mb-1">{s}</div>
        ))}
      </div>
    </div>
  );
}