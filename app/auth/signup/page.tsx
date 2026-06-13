'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

const checkPasswordStrength = (password: string) => {
  if (password.length < 8) return 'weak';
  if (!/[A-Z]/.test(password)) return 'weak';
  if (!/[0-9]/.test(password)) return 'weak';
  if (password.length < 12) return 'good';
  return 'strong';
};

export default function SignUpPage() {
  const router = useRouter();
  const auth = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = fullName && email && passwordsMatch && passwordStrength !== 'weak';

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'text-red-400';
      case 'good':
        return 'text-yellow-400';
      case 'strong':
        return 'text-green-400';
      default:
        return 'text-white/40';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.signUp(email, password, fullName);
      router.push('/auth/verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
      <p className="text-sm text-white/40 mb-6">Start your founder dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
        </div>

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
        <div>
          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
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
          {password && (
            <p className={`text-xs ${getStrengthColor(passwordStrength)}`}>
              Strength: {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-white/4 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-colors text-sm"
            required
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full h-11 mt-6 bg-white text-[#0c0a0a] font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-opacity text-sm"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-sm text-white/30">
        Already have an account?{' '}
        <button
          onClick={() => router.push('/auth/signin')}
          className="text-white hover:text-white/80 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
