'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeToggle';
import shared from '../../shared.module.css';

export default function SubmissionConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') ?? 'unknown';
  const classification = searchParams.get('classification') ?? 'Unclassified';
  const id = searchParams.get('id') ?? '';

  const isFullReview = tier === 'Full-review';
  const tierDisplay = isFullReview ? 'Full-review' : 'Light-touch';

  const nextStepsFullReview = [
    'Your submission has been routed to the reviewer pool for evaluation.',
    'You will receive an email notification when a decision is made (typically within 5 business days).',
    'You can monitor the status of your submission from your dashboard at any time.',
    'If requested, you will be asked to provide additional information or remediation details.',
  ];

  const nextStepsLightTouch = [
    'Your submission has been automatically approved for light-touch, self-service sign-off.',
    'No further review is required unless a cross-check discrepancy is detected.',
    'You can view and edit your entry anytime before finalization.',
    'A record of this submission will appear in the audit export for compliance review.',
  ];

  const nextSteps = isFullReview ? nextStepsFullReview : nextStepsLightTouch;

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Submission Confirmed</span>
        <ThemeToggle />
      </div>

      <section className={shared.screen}>
        <div className={shared.body} style={{ textAlign: 'center', padding: '48px 28px' }}>
          {/* Success indicator */}
          <div
            style={{
              fontSize: 48,
              marginBottom: 20,
              opacity: 0.8,
            }}
            aria-hidden="true"
          >
            ✓
          </div>

          {/* Main message */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '0 0 8px', color: 'var(--ink)' }}>
            Registration submitted successfully
          </h1>

          {/* Classification and tier */}
          <div className={shared.result} style={{ marginTop: 24, marginBottom: 32, justifyContent: 'center' }}>
            <div>
              <div className="rl">Classification & Tier</div>
              <div className="rv">
                {classification} · {tierDisplay}
              </div>
            </div>
          </div>

          {/* Reference ID */}
          {id && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Reference ID
              </label>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--ink)',
                  background: 'var(--surface-2)',
                  padding: '10px 14px',
                  borderRadius: 6,
                  display: 'inline-block',
                  userSelect: 'all',
                }}
              >
                {id}
              </code>
            </div>
          )}

          {/* Next steps */}
          <div style={{ marginTop: 32, marginBottom: 32, textAlign: 'left', maxWidth: '600px', margin: '32px auto' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>What happens next</h2>
            <ol style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              {nextSteps.map((step, i) => (
                <li key={i} style={{ marginBottom: i < nextSteps.length - 1 ? 10 : 0 }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/dashboard" className={`${shared.btn} ${shared.btnPrimary}`}>
              View your dashboard
            </Link>
            {!isFullReview && (
              <Link href="/register" className={shared.btn}>
                Register another item
              </Link>
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: 32,
              padding: '16px 20px',
              background: 'var(--surface-2)',
              borderRadius: 7,
              fontSize: 12.5,
              color: 'var(--ink-muted)',
              maxWidth: '600px',
              margin: '32px auto 0',
            }}
          >
            You can edit this submission anytime before a decision is made by visiting your dashboard entry.
            {isFullReview && ' Your reviewer pool will notify you if additional information is needed.'}
          </div>
        </div>
      </section>
    </main>
  );
}
