'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import shared from '../shared.module.css';

type Filter = 'all' | 'light_touch' | 'full_review' | 'cross_check_mismatch' | 'disputed';

const DEMO_DATA = [
  {
    id: '1',
    llm_provider: 'Claude 3 Opus',
    owner_name: 'Alice Chen',
    team: 'AI Platform',
    maturity: 'Product',
    classification: 'Autonomous Agent',
    tier: 'full_review',
    data: 'Customer ID, Financial',
    status: 'Assigned for review' as const,
  },
  {
    id: '2',
    llm_provider: 'GPT-4 Turbo',
    owner_name: 'Bob Martinez',
    team: 'Content',
    maturity: 'MVP',
    classification: 'Document Classifier',
    tier: 'light_touch',
    data: 'Public data',
    status: 'Approved' as const,
  },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = DEMO_DATA.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'light_touch' || filter === 'full_review') return e.tier === filter;
    return false;
  });

  const counts = {
    total: DEMO_DATA.length,
    fullReview: DEMO_DATA.filter((e) => e.tier === 'full_review').length,
    mismatch: 0,
  };

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
            <span className={shared.envBadge}>{counts.total} registered</span>
            <Link href="/export" className={shared.btn} style={{ padding: '6px 14px', fontSize: 12 }}>
              Export
            </Link>
          </div>
        </header>

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
          {(['all', 'light_touch', 'full_review', 'cross_check_mismatch', 'disputed'] as Filter[]).map((value) => (
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
              {value === 'all' ? 'All' : value === 'light_touch' ? 'Light-touch' : value === 'full_review' ? 'Full-review' : value === 'cross_check_mismatch' ? 'Flagged' : 'Disputed'}
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
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>{entry.classification}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                    <span className={`${shared.pill} ${entry.tier === 'full_review' ? shared.pillGold : shared.pillBlue}`}>
                      {entry.tier === 'full_review' ? 'Full-review' : 'Light-touch'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>{entry.data}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-2)' }}>
                    <span className={shared.sla}>{entry.status}</span>
                    {entry.tier === 'full_review' && (
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
      </section>
    </main>
  );
}
