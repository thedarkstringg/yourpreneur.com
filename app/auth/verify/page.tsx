'use client';

import { useRouter } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <Mail size={40} className="text-cyan-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-white mb-3">Check your inbox</h1>
          <p className="text-white/60 text-base mb-8">
            We sent a verification link to your email. Click it to confirm your account and start your founder journey.
          </p>

          {/* Info Box */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">Didn't receive an email?</span>
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>• Check your spam or junk folder</li>
              <li>• Wait a few moments and refresh</li>
              <li>• Try signing up again with the same email</li>
            </ul>
          </div>

          {/* Button */}
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            Back to Sign In
            <ArrowRight size={18} />
          </button>

          {/* Support Message */}
          <p className="mt-8 text-xs text-white/40">
            Questions? Email us at <a href="mailto:support@yourpreneurcanvas.com" className="text-white/60 hover:text-white underline">support@yourpreneurcanvas.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
