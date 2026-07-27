'use client';

export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeToggle';
import shared from '../../shared.module.css';

type Decision = 'approved' | 'more_info_requested' | 'remediation_required';

export default function DecisionConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const decision = (searchParams.get('decision') ?? 'approved') as Decision;
  const itemName = searchParams.get('itemName') ?? 'Agent';
  const ownerName = searchParams.get('ownerName') ?? 'Owner';
  const deadline = searchParams.get('deadline');

  const decisionConfig = {
    approved: {
      icon: '✓',
      title: 'Approved',
      color: 'var(--accent)',
      messages: [
        `${itemName} has been approved and marked safe for use in the audit trail.`,
        `${ownerName} will be notified of this decision immediately.`,
        'This item is now complete and will appear in the compliance audit export.',
      ],
    },
    more_info_requested: {
      icon: '?',
      title: 'More info requested',
      color: 'var(--stamp-gold)',
      messages: [
        `${ownerName} will be prompted to provide additional information before re-review.`,
        `You can track the status from your queue and follow up as needed.`,
        'Re-submission will automatically route back to you for continuity.',
      ],
    },
    remediation_required: {
      icon: '⚠',
      title: 'Remediation required',
      color: 'var(--stamp-red)',
      messages: [
        `${itemName} has been paused pending remediation.`,
        `${ownerName} has been notified and given until ${deadline || 'the specified date'} to resolve the issues.`,
        'The agent will remain non-operational until remediation is complete and approved.',
        "Monitor your queue for the owner's follow-up submission.",
      ],
    },
  };

  const config = decisionConfig[decision];

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Decision Confirmed</span>
        <ThemeToggle />
      </div>

      <section className={shared.screen}>
        <div className={shared.body} style={{ textAlign: 'center', padding: '48px 28px' }}>
          {/* Decision indicator */}
          <div
            style={{
              fontSize: 56,
              marginBottom: 16,
              opacity: 0.9,
              color: config.color,
            }}
            aria-hidden="true"
          >
            {config.icon}
          </div>

          {/* Main message */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '0 0 24px', color: 'var(--ink)' }}>
            Your decision has been recorded
          </h1>

          {/* Decision pill */}
          <div
            style={{
              display: 'inline-block',
              background: decision === 'approved' ? 'var(--accent-tint)' : decision === 'more_info_requested' ? 'var(--stamp-gold-tint)' : 'var(--stamp-red-tint)',
              color: config.color,
              padding: '8px 16px',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13.5,
              marginBottom: 32,
            }}
          >
            {config.title}
          </div>

          {/* Messages */}
          <div style={{ marginTop: 32, marginBottom: 32, textAlign: 'left', maxWidth: '600px', margin: '32px auto' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>What this means</h2>
            <ul
              style={{
                fontSize: 13.5,
                color: 'var(--ink)',
                lineHeight: 1.8,
                listStyle: 'none',
                paddingLeft: 0,
                margin: 0,
              }}
            >
              {config.messages.map((msg, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: i < config.messages.length - 1 ? 12 : 0,
                    paddingLeft: 24,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 2,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: config.color,
                      opacity: 0.6,
                    }}
                  />
                  {msg}
                </li>
              ))}
            </ul>
          </div>

          {/* Next actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/dashboard" className={`${shared.btn} ${shared.btnPrimary}`}>
              Back to your queue
            </Link>
            <button
              onClick={() => router.back()}
              className={shared.btn}
              style={{
                display: 'none',
              }}
            >
              View all items
            </button>
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: 32,
              padding: '16px 20px',
              background: 'var(--surface-2)',
              borderRadius: 7,
              fontSize: 12,
              color: 'var(--ink-muted)',
              maxWidth: '600px',
              margin: '32px auto 0',
            }}
          >
            This decision has been recorded in the audit trail with a timestamp. The owner will be notified via email.
          </div>
        </div>
      </section>
    </main>
  );
}
