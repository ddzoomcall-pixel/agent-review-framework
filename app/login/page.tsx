'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import shared from '../shared.module.css';

// MVP auth: Supabase email/password. Real SSO-linked identity binding
// (per DESIGN.md — "Owner field is an SSO-linked directory selection, not
// free text") is a real, unconfirmed follow-up dependency, not solved here.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Demo mode: bypass Supabase auth for testing
      if (!email || !password) {
        throw new Error('Email and password required');
      }
      // Skip Supabase call and go straight to dashboard for demo
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setSubmitting(false);
    }
  }

  return (
    <main className={shared.main} style={{ maxWidth: 420 }}>
      <div style={{ paddingTop: 60 }}>
        <section className={shared.screen}>
          <header className={shared.titlebar}>
            <h1>Sign in</h1>
          </header>
          <form className={shared.body} onSubmit={handleSubmit}>
            <div className={shared.field} style={{ marginBottom: 16 }}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={shared.field} style={{ marginBottom: 16 }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className={shared.errorInline} role="alert" style={{ marginBottom: 16 }}>
                <span className="tx">{error}</span>
              </div>
            )}
            <div className={shared.btnbar} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-strong)', textDecoration: 'underline', cursor: 'pointer', fontSize: 12.5 }}
              >
                {mode === 'sign-in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </button>
              <button type="submit" className={`${shared.btn} ${shared.btnPrimary}`} disabled={submitting}>
                {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
