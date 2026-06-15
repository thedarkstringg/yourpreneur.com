'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <Lock size={40} className="text-purple-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
          <p className="text-white/60 text-center mb-8">
            {step === 'email'
              ? 'Enter your email to receive a reset link'
              : 'Create a new secure password'}
          </p>

          {step === 'email' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Updating...' : 'Update Password'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* Back button */}
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full mt-6 py-3 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <ArrowLeft size={18} />
            Back to Sign In
          </button>

          {/* Support Message */}
          <p className="mt-8 text-xs text-white/40 text-center">
            Need help? Contact <a href="mailto:support@yourpreneurcanvas.com" className="text-white/60 hover:text-white underline">support@yourpreneurcanvas.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
