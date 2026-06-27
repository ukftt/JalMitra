import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login(res.data);
      navigate('/dashboard');
    } catch {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex relative bg-ink-900 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 0 0, transparent 0, #fff 80px)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="14" fill="#3BBAB9" />
              <path
                d="M15 7c2.5 4 5 7.2 5 10.5a5 5 0 11-10 0C10 14.2 12.5 11 15 7z"
                fill="#0B2545"
              />
            </svg>
            <span className="font-display font-bold text-lg tracking-tightest text-white">
              WATERWATCH
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-signal-400 font-mono text-sm tracking-wideish mb-3">
            MUNICIPAL ACCESS PORTAL
          </p>
          <h1 className="font-display font-bold text-4xl text-white leading-[1.1] tracking-tightest mb-4">
            Every report is a citizen waiting on an answer.
          </h1>
          <p className="text-surface-200/70 text-base max-w-md">
            Sign in to acknowledge, track, and resolve water quality issues
            reported across your ward.
          </p>
        </motion.div>

        <div className="relative z-10 flex gap-8 font-mono text-sm text-surface-200/60">
          <div>
            <p className="text-2xl text-white font-semibold">7-day</p>
            <p>auto-escalation window</p>
          </div>
          <div>
            <p className="text-2xl text-white font-semibold">100%</p>
            <p>public accountability</p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-8 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h2 className="font-display font-bold text-2xl text-ink-900 tracking-tightest mb-1">
            Welcome back
          </h2>
          <p className="text-ink-600 text-sm mb-8">
            Enter your municipal credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@municipality.gov.in"
                className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:outline-none focus:ring-2 focus:ring-signal-500 focus:border-signal-500 transition-shadow bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:outline-none focus:ring-2 focus:ring-signal-500 focus:border-signal-500 transition-shadow bg-white"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-alert-100 text-alert-700 text-sm font-medium rounded-lg px-3.5 py-2.5"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-900 text-white font-semibold text-sm rounded-lg py-2.5 hover:bg-ink-800 active:scale-[0.99] transition-all shadow-gauge disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-ink-600/70 text-center mt-8">
            Citizens don't need an account —{' '}
            <a href="/" className="text-signal-600 font-medium hover:underline">
              report an issue on the public map
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}