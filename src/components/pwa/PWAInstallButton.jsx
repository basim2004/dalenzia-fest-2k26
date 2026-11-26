import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
  isStandalone,
  isIOS,
  promptInstallApp,
  subscribePwaEvent
} from '../../services/pwaService';
import IOSInstallModal from './IOSInstallModal';

export default function PWAInstallButton({ variant = 'navbar', className = '' }) {
  const [isAppInstalled, setIsAppInstalled] = useState(() => (typeof window !== 'undefined' ? isStandalone() : false));
  const [isIOSDevice] = useState(() => (typeof window !== 'undefined' ? isIOS() : false));
  const [canInstall, setCanInstall] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (isStandalone()) return false;
    return isIOS();
  });
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isStandalone()) {
      return;
    }

    // Subscribe to installable state (triggered by beforeinstallprompt)
    const unsubscribe = subscribePwaEvent('installable', (installable) => {
      setCanInstall(installable || isIOS());
    });

    const unsubInstalled = subscribePwaEvent('installed', () => {
      setIsAppInstalled(true);
      setCanInstall(false);
    });

    return () => {
      unsubscribe();
      unsubInstalled();
    };
  }, []);

  const handleInstallClick = async (e) => {
    if (e) e.preventDefault();

    if (isIOSDevice) {
      setShowIOSModal(true);
      return;
    }

    const res = await promptInstallApp();
    if (res?.outcome === 'accepted') {
      setCanInstall(false);
      setIsAppInstalled(true);
    }
  };

  // If already standalone / installed, don't show
  if (isAppInstalled || !canInstall) {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#A91F35]/10 hover:bg-[#A91F35] text-[#A91F35] hover:text-white border border-[#A91F35]/30 text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs ${className}`}
          title="Install Dalenzia Fest App"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden min-[380px]:inline">Install App</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-[#E6A916]" />
          <span>Install Dalenzia App</span>
        </button>
      )}

      {variant === 'floating' && (
        <div className={`fixed bottom-5 left-5 z-40 hidden sm:block ${className}`}>
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1c1917]/90 hover:bg-[#1c1917] text-white border border-[#E6A916]/50 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 shrink-0">
              <img src="/icons/icon-192x192.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-bold text-white font-serif leading-tight">
                Install Dalenzia App
              </span>
              <span className="block text-[9px] text-[#E6A916] font-semibold leading-tight">
                Standalone 3D Experience
              </span>
            </div>
            <Download className="w-3.5 h-3.5 text-[#E6A916] group-hover:translate-y-0.5 transition-transform ml-1" />
          </button>
        </div>
      )}

      {/* iOS Modal */}
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
}
