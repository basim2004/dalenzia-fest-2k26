/**
 * DALENZIA FEST 2K26 - Progressive Web App (PWA) Lifecycle & Service Worker Manager
 */

let deferredInstallPrompt = null;
let waitingServiceWorker = null;

const listeners = {
  installable: new Set(),
  updateAvailable: new Set(),
  installed: new Set()
};

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function isIOS() {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
}

export function isIOSSafari() {
  if (!isIOS()) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios');
}

export function registerPwaService(onUpdateAvailable) {
  if (typeof window === 'undefined') return;

  // Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    listeners.installable.forEach((cb) => cb(true));
  });

  // Listen for appinstalled
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    listeners.installable.forEach((cb) => cb(false));
    listeners.installed.forEach((cb) => cb());
  });

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check if there is already a waiting worker
          if (registration.waiting) {
            waitingServiceWorker = registration.waiting;
            listeners.updateAvailable.forEach((cb) => cb());
            if (onUpdateAvailable) onUpdateAvailable();
          }

          // Check for newly found workers
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update is ready and waiting
                waitingServiceWorker = newWorker;
                listeners.updateAvailable.forEach((cb) => cb());
                if (onUpdateAvailable) onUpdateAvailable();
              }
            });
          });
        })
        .catch((error) => {
          console.warn('[PWA] Service worker registration failed:', error);
        });

      // Reload page when new worker takes control after skipWaiting
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

export async function promptInstallApp() {
  if (!deferredInstallPrompt) {
    return { outcome: 'unavailable' };
  }
  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      deferredInstallPrompt = null;
      listeners.installable.forEach((cb) => cb(false));
    }
    return choice;
  } catch (err) {
    console.warn('[PWA] Install prompt failed:', err);
    return { outcome: 'dismissed' };
  }
}

export function activateAppUpdate() {
  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  } else {
    window.location.reload();
  }
}

export function subscribePwaEvent(event, callback) {
  if (listeners[event]) {
    listeners[event].add(callback);
    if (event === 'installable') {
      callback(Boolean(deferredInstallPrompt));
    }
    return () => listeners[event].delete(callback);
  }
  return () => {};
}
