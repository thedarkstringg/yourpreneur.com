'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

type AuthMode = 'signup' | 'signin';

const copy = {
  signup: {
    title: 'Create your account',
    subtitle: 'Start mapping your ventures, pivots, launches, lessons, and wins in one living canvas.',
    action: 'Create account',
    pending: 'Creating account...',
    toggleCopy: 'Already have an account?',
    toggleAction: 'Sign in',
    labels: 'Sign up with',
    autocomplete: 'new-password',
  },
  signin: {
    title: 'Welcome back',
    subtitle: 'Return to your canvas and keep building the story behind your work.',
    action: 'Sign in',
    pending: 'Signing in...',
    toggleCopy: 'New to yourpreneur.com?',
    toggleAction: 'Create account',
    labels: 'Sign in with',
    autocomplete: 'current-password',
  },
} satisfies Record<AuthMode, {
  title: string;
  subtitle: string;
  action: string;
  pending: string;
  toggleCopy: string;
  toggleAction: string;
  labels: string;
  autocomplete: string;
}>;

function deriveFullName(email: string) {
  const name = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
  if (!name) return 'Founder';
  return name.replace(/\b\w/g, (character) => character.toUpperCase());
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Inline style tokens ───────────────────────────────────────────────────────
const S = {
  // Outermost wrapper: fills viewport, enables scroll on short screens
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    background: '#020202',
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    cursor: 'default',
    overflowX: 'hidden',
    // animated grid pan is handled via a <style> tag injected in the component
  } as React.CSSProperties,

  // Two-column grid — collapses to single on small screens via @media in the injected style
  page: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,

  // Left half: centers the card
  left: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    position: 'relative',
    zIndex: 10,
  } as React.CSSProperties,

  // The floating card
  card: {
    background: 'rgba(10,10,10,0.42)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '24px',
    padding: '24px 24px 20px',
    width: '100%',
    maxWidth: '420px',
    transition: 'opacity 0.15s ease',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  cardFading: {
    opacity: 0,
  } as React.CSSProperties,

  // Ambient background container (spotlights + tubes)
  ambient: {
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    overflow: 'hidden',
    pointerEvents: 'none',
  } as React.CSSProperties,

  // Toggle pill (Sign up / Sign in)
  pill: {
    display: 'inline-flex',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '999px',
    padding: '4px',
    marginBottom: '28px',
    gap: '2px',
  } as React.CSSProperties,

  pillBtn: (active: boolean): React.CSSProperties => ({
    padding: '6px 18px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 800,
    transition: 'all 0.15s',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#000000' : 'rgba(255,255,255,0.52)',
  }),

  eyebrow: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '8px',
  } as React.CSSProperties,

  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    marginBottom: '10px',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
    marginBottom: '28px',
  } as React.CSSProperties,

  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    minHeight: '40px',
    borderRadius: '999px',
    border: '1px solid #ffffff',
    background: '#ffffff',
    color: '#000000',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'opacity 0.15s, box-shadow 0.15s',
    boxShadow: '0 0 24px rgba(255,255,255,0.18)',
  } as React.CSSProperties,

  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    minHeight: '40px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.03)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
  } as React.CSSProperties,

  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  } as React.CSSProperties,

  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
  } as React.CSSProperties,

  input: {
    display: 'block',
    width: '100%',
    minHeight: '40px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.42)',
    color: '#ffffff',
    fontSize: '14px',
    padding: '0 14px',
    marginBottom: '10px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
    cursor: 'text',
  } as React.CSSProperties,

  error: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f87171',
    marginBottom: '10px',
  } as React.CSSProperties,

  toggleCopy: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '20px',
    marginBottom: '14px',
  } as React.CSSProperties,

  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '13px',
    padding: 0,
    marginLeft: '4px',
    textDecoration: 'none',
  } as React.CSSProperties,

  legal: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
    lineHeight: 1.6,
  } as React.CSSProperties,

  legalLink: {
    color: '#ffffff',
    fontWeight: 700,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    cursor: 'pointer',
  } as React.CSSProperties,

  // Right side visual panel
  right: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
  } as React.CSSProperties,

  visualImage: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as React.CSSProperties,
};

export default function AuthScreen({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const auth = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const activeCopy = copy[mode];

  const changeMode = (nextMode: AuthMode) => {
    if (nextMode === mode || isSwitching) return;
    setIsSwitching(true);
    window.setTimeout(() => {
      setMode(nextMode);
      setError('');
      router.replace(`/auth/${nextMode}`);
      window.setTimeout(() => setIsSwitching(false), 150);
    }, 150);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || password.length < 6) {
      setError('Please enter a valid email and at least 6 password characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await auth.signUp(normalizedEmail, password, deriveFullName(normalizedEmail));
        router.push('/');
      } else {
        await auth.signIn(normalizedEmail, password, false);
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setError('');
    setLoading(true);
    try {
      await auth.signInWithProvider(provider);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth authentication failed');
      setLoading(false);
    }
  };

  return (
    <div style={S.pageWrapper} className="auth-page-wrapper">
      {/* ── Injected global styles for animated grid, responsive layout, button hovers ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&display=swap');

        @keyframes pan-background {
          0%   { background-position: 0px 0px; }
          100% { background-position: 50px 50px; }
        }
        .auth-page-wrapper {
          animation: pan-background 40s linear infinite;
        }
        @keyframes breathe-panel {
          0%, 100% { transform: translateY(0); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1); }
          50%       { transform: translateY(-6px); box-shadow: 0 35px 55px -10px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.18); }
        }
        .auth-card-breathe { animation: breathe-panel 8s ease-in-out infinite; }
        @keyframes float-spotlight {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 50px) scale(1.1); }
        }
        @keyframes pulse-tube {
          0%   { opacity: 0.15; filter: blur(40px); }
          100% { opacity: 0.35; filter: blur(48px); }
        }
        @keyframes breathe-image {
          0%   { transform: scale(1); }
          100% { transform: scale(1.06); }
        }
        .auth-visual-image {
          animation: breathe-image 20s ease-in-out infinite alternate;
          transform-origin: center;
          opacity: 0.82;
          filter: saturate(0.85) contrast(1.08);
        }
        .auth-btn:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.28) !important; background: rgba(255,255,255,0.08) !important; box-shadow: 0 16px 36px rgba(0,0,0,0.35); }
        .auth-btn-primary:hover { background: #f0f0f0 !important; box-shadow: 0 0 34px rgba(255,255,255,0.34) !important; }
        .auth-input-el:focus { border-color: rgba(255,255,255,0.32) !important; background: rgba(255,255,255,0.04) !important; box-shadow: 0 0 0 4px rgba(255,255,255,0.06); }
        .auth-input-el::placeholder { color: rgba(255,255,255,0.35); }
        @media (max-width: 1023px) {
          .auth-right-panel { display: none !important; }
          .auth-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .auth-card-breathe { border-radius: 20px !important; }
        }
      `}</style>

      {/* ── Ambient spotlights ── */}
      <div style={S.ambient}>
        <div style={{
          position: 'absolute', borderRadius: '999px', filter: 'blur(100px)',
          opacity: 0.42, mixBlendMode: 'screen' as const,
          animation: 'float-spotlight 12s infinite ease-in-out alternate',
          width: '46vw', height: '46vw',
          background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0) 70%)',
          top: '-16%', left: '-12%',
        }} />
        <div style={{
          position: 'absolute', borderRadius: '999px', filter: 'blur(100px)',
          opacity: 0.42, mixBlendMode: 'screen' as const,
          animation: 'float-spotlight 12s infinite ease-in-out alternate',
          animationDelay: '-5s',
          width: '56vw', height: '56vw',
          background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(0,0,0,0) 70%)',
          right: '-18%', bottom: '-24%',
        }} />
        <div style={{
          position: 'absolute', borderRadius: '999px', filter: 'blur(42px)',
          opacity: 0.26,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.74) 50%, rgba(255,255,255,0) 100%)',
          animation: 'pulse-tube 6s ease-in-out infinite alternate',
          width: '78vw', height: '42px',
          top: '28%', left: '-24%', transform: 'rotate(-35deg)',
        }} />
        <div style={{
          position: 'absolute', borderRadius: '999px', filter: 'blur(42px)',
          opacity: 0.26,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(210,210,210,0.5) 50%, rgba(255,255,255,0) 100%)',
          animation: 'pulse-tube 6s ease-in-out infinite alternate',
          animationDelay: '-3s',
          width: '62vw', height: '58px',
          right: '-14%', bottom: '18%', transform: 'rotate(45deg)',
        }} />
      </div>

      <main style={S.page} className="auth-grid">
      {/* ── Left: card ── */}
      <div style={S.left}>
        <div style={{ ...S.card, ...(isSwitching ? S.cardFading : {}) }} className="auth-card-breathe">

          {/* Toggle pill */}
          <div style={S.pill}>
            <button
              type="button"
              style={S.pillBtn(mode === 'signup')}
              onClick={() => changeMode('signup')}
              disabled={loading || isSwitching}
            >
              Sign up
            </button>
            <button
              type="button"
              style={S.pillBtn(mode === 'signin')}
              onClick={() => changeMode('signin')}
              disabled={loading || isSwitching}
            >
              Sign in
            </button>
          </div>

          {/* Eyebrow + heading + subtitle */}
          <p style={S.eyebrow}>Your founder archive</p>
          <h1 style={S.title}>{activeCopy.title}</h1>
          <p style={S.subtitle}>{activeCopy.subtitle}</p>

          {/* OAuth buttons */}
          <button
            type="button"
            style={S.btnPrimary}
            className="auth-btn auth-btn-primary"
            onClick={() => emailRef.current?.focus()}
            disabled={loading}
          >
            <Mail size={18} strokeWidth={2} />
            <span>{activeCopy.labels} email</span>
          </button>

          <button
            type="button"
            style={S.btnSecondary}
            className="auth-btn"
            onClick={() => handleOAuth('github')}
            disabled={loading}
          >
            <GithubIcon />
            <span>{activeCopy.labels} GitHub</span>
          </button>

          <button
            type="button"
            style={S.btnSecondary}
            className="auth-btn"
            onClick={() => handleOAuth('google')}
            disabled={loading}
          >
            <GoogleIcon />
            <span>{activeCopy.labels} Google</span>
          </button>

          {/* Divider */}
          <div style={S.divider}>
            <span style={S.dividerLine} />
            or
            <span style={S.dividerLine} />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              style={S.input}
              className="auth-input-el"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              required
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              style={S.input}
              className="auth-input-el"
              type="password"
              autoComplete={activeCopy.autocomplete}
              placeholder="Password"
              required
              minLength={6}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={S.error}>{error}</p>}

            <button
              type="submit"
              style={{ ...S.btnPrimary, marginTop: '4px', marginBottom: 0 }}
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? activeCopy.pending : activeCopy.action}
            </button>
          </form>

          {/* Toggle copy */}
          <p style={S.toggleCopy}>
            {activeCopy.toggleCopy}
            <button
              type="button"
              style={S.toggleBtn}
              onClick={() => changeMode(mode === 'signin' ? 'signup' : 'signin')}
              disabled={loading || isSwitching}
            >
              {activeCopy.toggleAction}
            </button>
          </p>

          {/* Legal */}
          <p style={S.legal}>
            By continuing, you agree to yourpreneur.com&apos;s{' '}
            <a href="#" style={S.legalLink}>Terms</a>
            {' '}and{' '}
            <a href="#" style={S.legalLink}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* ── Right: visual ── */}
      <aside style={S.right} aria-label="Yourpreneur canvas preview" className="auth-right-panel">
        <div style={S.visualImage} className="auth-visual-image" />
      </aside>
    </main>
    </div>
  );
}