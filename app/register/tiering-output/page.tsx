'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const SENSITIVE_DATA = ['Confidential', 'Client', 'Personal', 'Deal', 'Financial', 'Legal', 'MNPI'];

type TierType = 'low' | 'review' | 'escalate' | 'unknown' | 'na' | 'pending';

interface TierResult {
  tier: TierType;
  label: string;
  reasons: string[];
  recommendations: string[];
}

function computeTier(answers: Record<string, any>): TierResult {
  const reasons: string[] = [];
  const recommendations: string[] = [];

  const q12 = answers.q12 || [];
  if (q12.length === 0) {
    return { tier: 'pending', label: 'Incomplete', reasons: ['Answer Q12 to classify'], recommendations: [] };
  }
  if (q12.length === 1 && q12[0] === 'None') {
    return {
      tier: 'na',
      label: 'Not Applicable',
      reasons: ['No AI tool or model in use'],
      recommendations: ['Exclude from governance registry if no AI is used'],
    };
  }

  // Check for escalation triggers
  if (answers.q14 === 'Yes') {
    reasons.push('Sends data to external vendors');
    recommendations.push('Conduct vendor risk assessment and data processing agreement');
  }
  if (answers.q15 === 'Yes') {
    reasons.push('Vendor may retain, train, or log data');
    recommendations.push('Escalate for legal/compliance review of data retention policies');
  }
  if (answers.q13 === 'Yes') {
    reasons.push('Uses multiple AI tools or models');
    recommendations.push('Document all AI models and their integration points');
  }
  if (answers.q18 === 'Yes') {
    reasons.push('Takes autonomous actions');
    recommendations.push('Implement logging and audit trail for all autonomous actions');
  }

  if (reasons.length > 0) {
    return {
      tier: 'escalate',
      label: 'Escalate — Formal Approval Required',
      reasons,
      recommendations: [...recommendations, 'Requires CRO or executive review and sign-off before production use'],
    };
  }

  // Check for review triggers
  const dataFlags = (answers.q8 || []).filter((d: string) => SENSITIVE_DATA.includes(d));
  if (dataFlags.length) {
    reasons.push(`Handles sensitive data: ${dataFlags.join(', ')}`);
    recommendations.push(`Implement access controls and encryption for ${dataFlags.join(', ')} data`);
  }
  if (answers.q6 === 'Multiple') {
    reasons.push('Can touch multiple clients');
    recommendations.push('Implement data segregation controls and client isolation testing');
  }
  if (answers.q6 === 'Unknown') {
    reasons.push('Number of clients is unknown');
    recommendations.push('Clarify client scope and usage boundaries');
  }
  if (answers.q10 === 'Commingled across clients') {
    reasons.push('Commingles data from multiple clients');
    recommendations.push('Urgent: implement data isolation controls to prevent cross-client leakage');
  }
  if (answers.q7 === 'Yes') {
    reasons.push('Reuses prompts/outputs across clients');
    recommendations.push('Document cross-client reuse and implement content filtering');
  }
  if (answers.q26 === 'Yes') {
    reasons.push('Client-specific restrictions or wall-crossing issues exist');
    recommendations.push('Ensure compliance with client agreements and Chinese walls');
  }
  if (answers.q9 === 'Raw client data') {
    reasons.push('Accesses raw client data');
    recommendations.push('Implement row-level security and audit all access');
  }

  if (reasons.length > 0) {
    return {
      tier: 'review',
      label: 'Review Required',
      reasons,
      recommendations: [...recommendations, 'Requires security/compliance review before production deployment'],
    };
  }

  // Low risk
  return {
    tier: 'low',
    label: 'Low Risk',
    reasons: ['Uses public/synthetic data only', 'No external vendor transmission', 'No cross-client exposure risks'],
    recommendations: [
      'Can proceed to production with standard change management',
      'Implement basic logging for audit trail',
      'Schedule annual governance review',
    ],
  };
}

function TieringContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const answersStr = searchParams.get('answers');
  const answers = answersStr ? JSON.parse(decodeURIComponent(answersStr)) : {};
  const tierResult = computeTier(answers);

  const tierColors: Record<TierType, { bg: string; color: string; border: string }> = {
    low: { bg: '#e1f5ee', color: '#0f6e56', border: '#4db8a3' },
    review: { bg: '#faeeda', color: '#854f0b', border: '#d4a574' },
    escalate: { bg: '#fcebeb', color: '#a32d2d', border: '#e08080' },
    unknown: { bg: '#e2e0da', color: '#2c2c2a', border: '#b0ada0' },
    na: { bg: '#f1efe8', color: '#5f5e5a', border: '#c9c6bd' },
    pending: { bg: '#f0f4f8', color: '#64748b', border: '#cbd5e1' },
  };

  const colors = tierColors[tierResult.tier];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Tiering Output</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{answers.q1 || 'AI Solution'}</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Main Tier Result */}
        <div style={{ backgroundColor: 'white', border: `2px solid ${colors.border}`, borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {tierResult.tier === 'low' ? '✓' : tierResult.tier === 'review' ? '⚠' : tierResult.tier === 'escalate' ? '🔴' : '?'}
            </div>
            <h2 style={{ fontSize: '28px', color: colors.color, margin: '0 0 12px', fontWeight: '600' }}>
              {tierResult.label}
            </h2>
            <div
              style={{
                display: 'inline-block',
                background: colors.bg,
                color: colors.color,
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Tier: {tierResult.tier.toUpperCase()}
            </div>
          </div>

          {/* Key Findings */}
          {tierResult.reasons.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Key Findings</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#5a5850', lineHeight: '1.8' }}>
                {tierResult.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {tierResult.recommendations.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Recommendations</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#5a5850', lineHeight: '1.8' }}>
                {tierResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px' }}>Intake Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Solution</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q1 || '(Not specified)'}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Business Owner</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q2 || '(Not specified)'}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>AI Tools</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{(answers.q12 || []).join(', ') || 'None'}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Lifecycle</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q20 || '(Not specified)'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Data Types</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{(answers.q8 || []).join(', ') || 'None'}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            href="/register/form"
            style={{
              padding: '10px 20px',
              border: '1px solid #c9c6bd',
              borderRadius: '10px',
              background: 'white',
              color: '#2e4b6b',
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            ← Edit Form
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Back to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TieringOutputPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading tiering output...</div>}>
      <TieringContent />
    </Suspense>
  );
}
