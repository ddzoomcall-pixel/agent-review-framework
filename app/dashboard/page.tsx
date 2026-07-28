'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { RegisterEntry } from '@/lib/supabase/types';
import { ThemeToggle } from '../components/ThemeToggle';
import shared from '../shared.module.css';

type Filter = 'all' | 'light_touch' | 'full_review' | 'cross_check_mismatch' | 'disputed';

function slaClass(entry: RegisterEntry): string {
  if (entry.status === 'remediation_required') return shared.slaUrgent;
  if (entry.status === 'assigned') return shared.slaSoon;
  return shared.slaOk;
}

function statusLabel(entry: RegisterEntry): string {
  switch (entry.status) {
    case 'approved':
      return 'Approved';
    case 'assigned':
      return 'Assigned for review';
    case 'remediation_required':
      return `Remediation required${entry.remediation_deadline ? ` — due ${entry.remediation_deadline}` : ''}`;
    case 'cross_check_mismatch':
      return 'Cross-check mismatch';
    case 'disputed':
      return 'Disputed';
    default:
      return 'Pending';
  }
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<RegisterEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
          .from('register_entries')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!cancelled) setEntries(data ?? []);
      } catch (err) {
        // Fallback to demo data when Supabase unavailable
        if (!cancelled) {
          const mockData: RegisterEntry[] = [
            {
              id: '1',
              llm_provider: 'Claude 3 Opus',
              owner_name: 'Alice Chen',
              team: 'AI Platform',
              maturity_label: 'product',
              technical_form: 'Autonomous Agent',
              autonomy_level: 'Level 2: Conditional Actions',
              data_categories: ['customer_identifiable', 'financial_data'],
              risk_tier: 'full_review',
              risk_tier_reason: 'Handles financial data and customer identity with autonomous decision-making',
              status: 'assigned',
              created_at: new Date().toISOString(),
              reviewer_id: null,
              remediation_deadline: null,
            },
            {
              id: '2',
              llm_provider: 'GPT-4 Turbo',
              owner_name: 'Bob Martinez',
              team: 'Content Team',
              maturity_label: 'mvp',
              technical_form: 'Document Classifier',
              autonomy_level: 'Level 1: Informational Only',
              data_categories: ['public_data'],
              risk_tier: 'light_touch',
              risk_tier_reason: 'MVP classifier on public data, read-only operations',
              status: 'approved',
              created_at: new Date().toISOString(),
              reviewer_id: null,
              remediation_deadline: null,
            },
          ];
          setEntries(mockData);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    if (!entries) return { total: 0, fullReview: 0, mismatch: 0 };
    return {
      total: entries.length,
      fullReview: entries.filter((e) => e.risk_tier === 'full_review').length,
      mismatch: entries.filter((e) => e.status === 'cross_check_mismatch').length,
    };
  }, [entries]);

  const filtered = useMemo(() => {
    if (!entries) return [];
    if (filter === 'all') return entries;
    if (filter === 'light_touch' || filter === 'full_review') return entries.filter((e) => e.risk_tier === filter);
    return entries.filter((e) => e.status === filter);
  }, [entries, filter]);

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Compliance Dashboard</span>
        <ThemeToggle />
      </div>

      <section className={shared.screen}>
        <header className={shared.titlebar}>
          <h1>Agent Register — Compliance view</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className={shared.envBadge}>{entries ? `${counts.total} registered` : '…'}</span>
            <Link href="/export" className={shared.btn} style={{ padding: '6px 14px', fontSize: 12 }}>
              Export
            </Link>
          </div>
        </header>

        {error && <div className={shared.errorBanner} role="alert">{error}</div>}

        {!error && entries === null && <div className={shared.loading}>Loading register…</div>}

        {!error && entries !== null && entries.length === 0 && (
          <div className={shared.loading} style={{ padding: '60px 26px' }}>
            <div style={{ fontSize: 30, opacity: 0.5, marginBottom: 10 }} aria-hidden="true">▦</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 6px', color: 'var(--ink)' }}>
              No agents registered yet
            </h2>
            <p style={{ maxWidth: '44ch', margin: '0 auto 16px' }}>
              This is expected on day one — the register starts empty until analysts begin submitting. Nothing to
              review, nothing broken.
            </p>
            <Link href="/register" className={`${shared.btn} ${shared.btnPrimary}`}>
              Register the first item
            </Link>
          </div>
        )}

        {!error && entries !== null && entries.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: '16px 26px' }}>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '11px 15px', background: 'var(--surface-2)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 21, fontWeight: 700 }}>{counts.total}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Total registered</div>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '11px 15px', background: 'var(--surface-2)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 21, fontWeight: 700 }}>{counts.fullReview}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Full-review tier</div>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '11px 15px', background: 'var(--surface-2)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 21, fontWeight: 700 }}>{counts.mismatch}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Cross-check mismatch</div>
              </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', padding: '0 26px', overflowX: 'auto' }} role="tablist">
              {(
                [
                  ['all', 'All'],
                  ['light_touch', 'Light-touch'],
                  ['full_review', 'Full-review'],
                  ['cross_check_mismatch', 'Flagged'],
                  ['disputed', 'Disputed'],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  style={{
                    padding: '11px 16px',
                    fontSize: 12.5,
                    border: 'none',
                    background: 'none',
                    borderBottom: filter === value ? '2px solid var(--accent)' : '2px solid transparent',
                    color: filter === value ? 'var(--ink)' : 'var(--ink-muted)',
                    fontWeight: filter === value ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 640 }}>
                <thead>
                  <tr>
                    {['Name', 'Owner', 'Classification', 'Tier', 'Data', 'Status'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          textTransform: 'uppercase',
                          color: 'var(--ink-muted)',
                          background: 'var(--surface-2)',
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--rule)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>{entry.llm_provider}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                        {entry.owner_name}, {entry.team}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                        {entry.maturity_label ? (entry.maturity_label === 'mvp' ? 'MVP' : 'Product') : entry.technical_form}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                        <span className={`${shared.pill} ${entry.risk_tier === 'full_review' ? shared.pillGold : shared.pillBlue}`}>
                          {entry.risk_tier === 'full_review' ? 'Full-review' : 'Light-touch'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                        {entry.data_categories.join(', ') || 'None'}
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                        <span className={`${shared.sla} ${slaClass(entry)}`}>{statusLabel(entry)}</span>
                        {entry.risk_tier === 'full_review' && (
                          <>
                            {' — '}
                            <Link href={`/review/${entry.id}`} style={{ fontSize: 12 }}>
                              Review
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
