'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ChooseTierContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'unknown';

  const typeNames = {
    agent: 'Agent',
    workflow: 'Workflow',
    tool: 'Internal Tool',
    product: 'Product',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Choose Your Tier</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Type: <strong>{typeNames[type as keyof typeof typeNames] || 'Unknown'}</strong>
        </p>
      </div>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: '30px' }}>
            What review tier does this need?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
          {/* Light-Touch Card */}
          <div
            onClick={() => router.push(`/register/questionnaire?tier=light_touch&type=${type}`)}
            style={{
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '32px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
            <h3 style={{ color: '#1e3a8a', margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Light-touch
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '13px', lineHeight: '1.6' }}>
              Minimal risk, quick questionnaire, auto-approved with minimal oversight.
            </p>
            <ul style={{ fontSize: '12px', color: '#64748b', textAlign: 'left', margin: '16px 0 0', paddingLeft: '20px' }}>
              <li>Quick questionnaire</li>
              <li>Auto-approved</li>
              <li>Minimal oversight</li>
            </ul>
          </div>

          {/* Full-Review Card */}
          <div
            onClick={() => router.push(`/register/questionnaire?tier=full_review&type=${type}`)}
            style={{
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '32px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
            <h3 style={{ color: '#1e3a8a', margin: '0 0 12px', fontSize: '20px', fontWeight: '600' }}>
              Full-review
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '13px', lineHeight: '1.6' }}>
              High risk, comprehensive questionnaire, expert reviewer required, formal approval.
            </p>
            <ul style={{ fontSize: '12px', color: '#64748b', textAlign: 'left', margin: '16px 0 0', paddingLeft: '20px' }}>
              <li>Comprehensive questionnaire</li>
              <li>Expert reviewer required</li>
              <li>Formal approval process</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/register/classify" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
            ← Change classification
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ChooseTierPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChooseTierContent />
    </Suspense>
  );
}
