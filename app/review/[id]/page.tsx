'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { RegisterEntry } from '@/lib/supabase/types';
import { ThemeToggle } from '../../components/ThemeToggle';
import shared from '../../shared.module.css';

type DecisionOutcome = { label: string; detail: string } | null;

export default function ReviewerDecisionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<RegisterEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRemediationPanel, setShowRemediationPanel] = useState(false);
  const [remediationDays, setRemediationDays] = useState(5);
  const [saving, setSaving] = useState(false);
  const [outcome, setOutcome] = useState<DecisionOutcome>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('register_entries').select('*').eq('id', params.id).single();
        if (error) throw error;
        if (!cancelled) setEntry(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load this item.');
      }
    }
    if (params.id) load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function recordDecision(decision: 'approved' | 'more_info_requested' | 'remediation_required', detail: string, deadline?: string) {
    if (!entry) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not signed in.');

      const { error: decisionError } = await (supabase as any).from('decisions').insert({
        register_entry_id: entry.id,
        reviewer_id: user.id,
        decision,
        detail,
      });
      if (decisionError) throw decisionError;

      const statusMap = {
        approved: 'approved',
        more_info_requested: 'pending',
        remediation_required: 'remediation_required',
      } as const;

      const { error: updateError } = await supabase
        .from('register_entries')
        .update({
          status: statusMap[decision],
          reviewer_id: user.id,
          remediation_deadline: deadline ?? null,
        })
        .eq('id', entry.id);
      if (updateError) throw updateError;

      const labels = {
        approved: 'approved',
        more_info_requested: 'more_info_requested',
        remediation_required: 'remediation_required',
      };

      // Redirect to confirmation page
      const params = new URLSearchParams({
        decision: labels[decision],
        itemName: entry.llm_provider ?? 'Agent',
        ownerName: entry.owner_name ?? 'Owner',
        ...(deadline && { deadline }),
      });
      router.push(`/review/confirmation?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this decision.');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <main className={shared.main}>
        <div className={shared.errorBanner} role="alert" style={{ marginTop: 24 }}>
          {error}
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className={shared.main}>
        <div className={shared.loading} style={{ marginTop: 24 }}>Loading…</div>
      </main>
    );
  }

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Reviewer Decision</span>
        <ThemeToggle />
      </div>

      <section className={shared.screen}>
        <header className={shared.titlebar}>
          <h1>{entry.llm_provider}</h1>
          <span className={shared.envBadge}>
            {entry.risk_tier === 'full_review' ? 'Full-review' : 'Light-touch'}
            {entry.remediation_deadline ? ` · Due ${entry.remediation_deadline}` : ''}
          </span>
        </header>

        <div className={shared.body}>
          <div className={shared.row}>
            <div className={shared.field}>
              <label>Owner</label>
              <input value={`${entry.owner_name}, ${entry.team}`} readOnly />
            </div>
            <div className={shared.field}>
              <label>Classification</label>
              <input
                value={entry.maturity_label ? `${entry.maturity_label === 'mvp' ? 'MVP' : 'Product'} (is a ${entry.technical_form})` : entry.technical_form ?? '—'}
                readOnly
              />
            </div>
          </div>
          <div className={shared.row}>
            <div className={shared.field}>
              <label>Autonomy level</label>
              <input value={entry.autonomy_level ?? '—'} readOnly />
            </div>
            <div className={shared.field}>
              <label>Data touched</label>
              <input value={entry.data_categories.join(', ') || 'None'} readOnly />
            </div>
          </div>

          <div
            style={{
              border: '1.5px solid var(--stamp-gold)',
              background: 'var(--stamp-gold-tint)',
              borderRadius: 7,
              padding: '14px 16px',
              margin: '6px 0 22px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stamp-gold)', textTransform: 'uppercase', marginBottom: 5 }}>
              Why this is {entry.risk_tier === 'full_review' ? 'Full-review' : 'Light-touch'}
            </div>
            <p style={{ fontSize: 12.5, margin: 0 }}>{entry.risk_tier_reason ?? 'No reason recorded.'}</p>
          </div>

          <h2 style={{ fontSize: 13.5, fontWeight: 600, margin: '22px 0 12px' }}>Decision</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className={`${shared.btn} ${shared.btnPrimary}`}
              disabled={saving}
              onClick={() => recordDecision('approved', `${entry.owner_name} has been notified. This item moves to the audit trail as approved.`)}
            >
              Approve
            </button>
            <button
              className={shared.btn}
              disabled={saving}
              onClick={() =>
                recordDecision('more_info_requested', `${entry.owner_name} will be prompted for additional detail before this can be re-reviewed.`)
              }
            >
              Request more info
            </button>
            <button
              className={`${shared.btn} ${shared.btnDanger}`}
              disabled={saving}
              aria-expanded={showRemediationPanel}
              onClick={() => setShowRemediationPanel((s) => !s)}
            >
              Require remediation
            </button>
          </div>

          {showRemediationPanel && (
            <div
              style={{
                border: '1.5px solid var(--stamp-red)',
                background: 'var(--stamp-red-tint)',
                borderRadius: 7,
                padding: '16px 18px',
                marginTop: 14,
              }}
            >
              <label style={{ display: 'block', fontSize: 12, color: 'var(--stamp-red)', marginBottom: 6 }}>
                Fix-by deadline (business days from today)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={remediationDays}
                onChange={(e) => setRemediationDays(Number(e.target.value))}
                style={{
                  border: '1.5px solid var(--stamp-red)',
                  borderRadius: 6,
                  padding: '8px 11px',
                  width: 140,
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                }}
              />
              <p style={{ fontSize: 11.5, color: 'var(--stamp-red)', margin: '8px 0 12px', maxWidth: '60ch' }}>
                This pauses the agent and sets the fix-by deadline shown above — the shutdown authority named in
                the design doc&apos;s Success Criteria, made concrete here. Owner is notified immediately.
              </p>
              <button
                className={`${shared.btn} ${shared.btnDanger}`}
                disabled={saving}
                onClick={() => {
                  const deadline = new Date();
                  deadline.setDate(deadline.getDate() + remediationDays);
                  recordDecision(
                    'remediation_required',
                    `Agent paused. Fix-by deadline set to ${remediationDays} business days. ${entry.owner_name} notified immediately.`,
                    deadline.toISOString().slice(0, 10)
                  );
                }}
              >
                Confirm — pause agent &amp; notify owner
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
