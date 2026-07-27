'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { RegisterEntry } from '@/lib/supabase/types';
import { ThemeToggle } from '../components/ThemeToggle';
import shared from '../shared.module.css';

export default function ExportPage() {
  const [entries, setEntries] = useState<RegisterEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [period, setPeriod] = useState('Q3 2026');
  const [lastExported, setLastExported] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await (supabase as any).from('register_entries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (!cancelled) setEntries(data ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load the register.');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!entries) return { total: 0, fullReview: 0, approved: 0, remediation: 0, mismatch: 0 };
    return {
      total: entries.length,
      fullReview: entries.filter((e) => e.risk_tier === 'full_review').length,
      approved: entries.filter((e) => e.status === 'approved').length,
      remediation: entries.filter((e) => e.status === 'remediation_required').length,
      mismatch: entries.filter((e) => e.status === 'cross_check_mismatch').length,
    };
  }, [entries]);

  async function handleExport() {
    setExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const headers = ['ID', 'Name', 'Owner', 'Team', 'Classification', 'Tier', 'Status'];
      const rows = entries!.map((e) => [e.id.slice(0, 8), e.llm_provider, e.owner_name, e.team, e.maturity_label || e.technical_form, e.risk_tier, e.status]);
      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell)}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-register-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setLastExported(new Date().toISOString());
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Audit Export</span>
        <ThemeToggle />
      </div>
      <section className={shared.screen}>
        <header className={shared.titlebar}>
          <h1>Audit Export</h1>
          <span className={shared.envBadge}>Compliance</span>
        </header>
        <div className={shared.body}>
          {!error && entries && (
            <>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32}}>
                <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', background: 'var(--surface-2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{stats.total}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Total</div>
                </div>
                <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', background: 'var(--surface-2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{stats.fullReview}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Full-review</div>
                </div>
                <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', background: 'var(--surface-2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{stats.approved}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Approved</div>
                </div>
                <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', background: 'var(--surface-2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700 }}>{stats.remediation}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Remediation</div>
                </div>
              </div>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Generate Export</h2>
              <div className={shared.row}>
                <div className={shared.field}>
                  <label htmlFor="period">Reporting period</label>
                  <input id="period" value={period} onChange={(e) => setPeriod(e.target.value)} />
                </div>
                <div className={shared.field}>
                  <label htmlFor="format">Format</label>
                  <select id="format" value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)}>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button data-export-btn className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleExport} disabled={exporting}>
                  {exporting ? 'Preparing…' : `Download as ${exportFormat.toUpperCase()}`}
                </button>
              </div>
              {lastExported && (
                <div className={shared.result} style={{ marginTop: 24 }}>
                  <div><div className="rl">Export ready</div><div className="rv">Downloaded</div></div>
                  <div className="rn">Generated at {new Date(lastExported).toLocaleTimeString()}</div>
                </div>
              )}
              <div style={{marginTop: 32}}>
                <Link href="/dashboard" className={shared.btn}>Back to dashboard</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
