import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Capture the beforeinstallprompt event BEFORE React mounts.
// The browser fires this event early — if we only listen inside a React
// useEffect, the event has already fired and been missed.
window.__pwaInstallPromptEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__pwaInstallPromptEvent = e;
});

createRoot(document.getElementById("root")!).render(<App />);
