'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, getSession } from '../../lib/session';
import { apiPost } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace('/admin');
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const admin = await apiPost('/auth/login', { email, password });
      createSession(admin);
      router.replace('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: 'min(420px, 100%)' }}>
        <div className="stack">
          <header>
            <h1 style={{ margin: 0 }}>KCI CMS Login</h1>
            <p style={{ marginTop: '0.35rem', color: '#555' }}>
              Enter your admin credentials to continue.
            </p>
          </header>
          {error ? <div className="alert">{error}</div> : null}
          <form className="stack" onSubmit={handleSubmit}>
            <label className="stack">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </label>
            <label className="stack">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
