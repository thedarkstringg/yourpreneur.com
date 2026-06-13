'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function ResetPage() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.resetPassword(email);
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.updatePassword(newPassword);
      router.push('/auth/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
      <p className="text-sm text-white/40 mb-6">
        {step === 'email' ? 'Enter your email to receive a reset link' : 'Create a new password'}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white text-[#0c0a0a] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-opacity text-sm mt-6"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white text-[#0c0a0a] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-opacity text-sm mt-6"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      <button
        onClick={() => router.push('/auth/signin')}
        className="w-full mt-4 text-center text-white/40 hover:text-white/60 transition-colors text-sm"
      >
        Back to Sign In
      </button>
    </div>
  );
}
