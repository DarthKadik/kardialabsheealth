import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Robust Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('Page loaded, attempting to register service worker...');
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered successfully with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed: ', error);
      });
  });
} else {
  console.log('Service Worker is not supported by this browser.');
}
// --- End of Registration Code ---

createRoot(document.getElementById("root")!).render(<App />);
