'use client';

import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-cyan-500/20 rounded-lg">
          <Mail size={32} className="text-cyan-500" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">Check your inbox</h2>
      <p className="text-sm text-white/60 mb-6">
        We sent a verification link to your email. Click it to confirm your account.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-sm text-white/50">
        <p>Didn't receive an email? Check your spam folder or wait a few moments.</p>
      </div>

      <button
        onClick={() => router.push('/auth/signin')}
        className="w-full h-11 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/15 transition-colors text-sm"
      >
        Back to Sign In
      </button>
    </div>
  );
}
