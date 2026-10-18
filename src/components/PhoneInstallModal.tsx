import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  X, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Share,
  Globe
} from 'lucide-react';

interface PhoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectInstall?: () => void;
  canDirectInstall?: boolean;
}

export const PhoneInstallModal: React.FC<PhoneInstallModalProps> = ({
  isOpen,
  onClose,
  onDirectInstall,
  canDirectInstall,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setCurrentUrl(url);

      QRCode.toDataURL(url, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrCodeDataUrl(dataUrl))
        .catch((err) => console.error('Failed to generate QR code:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard && currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">
                Install on Your Phone
              </h2>
              <p className="text-xs text-slate-400">
                Installs directly to your home screen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Highlight callout */}
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300">
                100% Wireless & Instant:
              </span>{' '}
              No cable needed. Open this link on your phone to install directly to your home screen with offline support.
            </div>
          </div>

          {/* QR Code and Quick Scan Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="bg-white p-2 rounded-xl shrink-0 shadow-md">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Scan QR code with phone camera to install" 
                  className="w-32 h-32 rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                  Loading QR...
                </div>
              )}
            </div>

            <div className="space-y-2.5 flex-1 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-white text-sm">
                  1. Scan with Phone Camera
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Point your phone's camera at this QR code to open the link instantly.
                </p>
              </div>

              {/* Copy Link Input */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 justify-center sm:justify-start">
                  <Globe className="w-3 h-3 text-orange-400" />
                  Or open this link on your phone:
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 w-full font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 shrink-0 transition"
                    title="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step by step for phone */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
              2. Tap Install on Your Phone:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Android Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    A
                  </span>
                  <span className="font-bold text-xs text-white">Android (Chrome)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open link $\rightarrow$ Tap <strong>"Install App"</strong> banner, or menu (⋮) $\rightarrow$ <strong>"Install app"</strong>.
                </p>
              </div>

              {/* iOS Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                    i
                  </span>
                  <span className="font-bold text-xs text-white">iPhone / iPad (Safari)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open in Safari $\rightarrow$ Tap <strong>Share</strong> (<Share className="w-3 h-3 inline text-blue-400" />) $\rightarrow$ <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Direct install if browser supports it right here */}
          {canDirectInstall && onDirectInstall && (
            <div className="pt-1">
              <button
                onClick={() => {
                  onDirectInstall();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Install on This Device Right Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Offline PWA Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
