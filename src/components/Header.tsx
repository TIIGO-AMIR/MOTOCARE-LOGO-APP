import React, { useState } from 'react';
import { 
  Bike, 
  Coins, 
  LayoutDashboard, 
  Download, 
  Plus,
  Share,
  PlusSquare,
  X,
  Smartphone
} from 'lucide-react';
import { ActiveTab } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PhoneInstallModal } from './PhoneInstallModal';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddService: () => void;
  onOpenAddMotorcycle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddService,
}) => {
  const { isInstallable, isInstalled, install, showIOSModal, closeIOSModal } = usePWAInstall();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleInstallClick = async () => {
    const isMobileDevice = typeof window !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isMobileDevice && isInstallable) {
      await install();
    } else {
      setShowPhoneModal(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo - Plain solid colors */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight group-hover:text-orange-400 transition">
                MotoService Log
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700 font-mono">
                UGX
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Motorcycle Service &amp; Expenditure Tracker
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('motorcycles')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'motorcycles'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Motorcycles</span>
          </button>

          <button
            onClick={() => onSelectTab('expenditure')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'expenditure'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Expenditure</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Install Button: Only visible before install; disappears completely once installed on phone */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              title="Install App to Phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install to Phone</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}

          {/* Quick Add Service */}
          <button
            onClick={onOpenAddService}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Service</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal (Plain solid colors) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={closeIOSModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To install this app on your phone home screen from Safari:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="w-6 h-6 rounded-md bg-slate-700 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Step 1:</span>
                  <p className="text-slate-300">Tap the <strong className="text-white">Share</strong> button at the bottom of Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="w-6 h-6 rounded-md bg-slate-700 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Step 2:</span>
                  <p className="text-slate-300">Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
              </div>
            </div>

            <button
              onClick={closeIOSModal}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-sm transition active:scale-95"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}

      {/* Phone Install / QR Code Modal */}
      <PhoneInstallModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onDirectInstall={install}
        canDirectInstall={isInstallable}
      />
    </header>
  );
};

export const MobileBottomNav: React.FC<{
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}> = ({ activeTab, onSelectTab }) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 pb-safe print:hidden"
    >
      <div className="grid grid-cols-3 h-14">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
            activeTab === 'dashboard' ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onSelectTab('motorcycles')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
            activeTab === 'motorcycles' ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bikes</span>
        </button>

        <button
          onClick={() => onSelectTab('expenditure')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
            activeTab === 'expenditure' ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Expenses</span>
        </button>
      </div>
    </nav>
  );
};
