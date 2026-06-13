'use client';

import { X, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpgradePrompt({
  isOpen,
  onClose,
  feature,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  message?: string;
}) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-white/10 rounded-lg max-w-sm w-full shadow-xl animate-in fade-in zoom-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-sm font-semibold text-white">Premium Feature</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {feature && (
            <h3 className="text-sm font-semibold text-white mb-2">{feature}</h3>
          )}
          <p className="text-sm text-white/60 mb-6">
            {message || 'This feature is only available on Premium. Upgrade now to unlock unlimited possibilities.'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
            >
              Maybe later
            </button>
            <button
              onClick={() => {
                router.push('/billing');
                onClose();
              }}
              className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg font-semibold transition-colors"
            >
              Upgrade →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
