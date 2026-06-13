'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

export default function SignInPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.signIn(email, password, rememberMe);
      router.push('/canvas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
      <p className="text-sm text-white/40 mb-6">Access your portfolio</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-cyan-500"
          />
          <label htmlFor="remember" className="text-xs text-white/50">
            Remember me for 30 days
          </label>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-6 bg-white text-[#0c0a0a] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-opacity text-sm"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 space-y-3 text-sm">
        <button
          onClick={() => router.push('/auth/reset')}
          className="block w-full text-center text-white/40 hover:text-white/60 transition-colors"
        >
          Forgot password?
        </button>
        <p className="text-center text-white/30">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-white hover:text-white/80 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
