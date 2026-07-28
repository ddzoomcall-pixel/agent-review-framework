'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Category = 'agent' | 'workflow' | 'tool' | 'mvp' | 'product';

const categoryInfo: Record<Category, { icon: string; title: string; description: string; governance: string[] }> = {
  agent: {
    icon: '🤖',
    title: 'Agent',
    description: 'Autonomous system that makes decisions and takes independent actions',
    governance: [
      'Requires formal governance approval before production',
      'Mandate: Human-in-the-loop review for all autonomous actions',
      'Implement comprehensive audit logging',
      'Quarterly security review required',
      'Must have kill-switch and rollback capability',
    ],
  },
  workflow: {
    icon: '⚙️',
    title: 'Workflow',
    description: 'Orchestration system that coordinates multiple tools and human steps',
    governance: [
      'Requires process documentation and owner sign-off',
      'Mandate: Integration testing for all connected systems',
      'Implement error handling and fallback procedures',
      'Annual process review required',
      'Must track audit trail of workflow executions',
    ],
  },
  tool: {
    icon: '🔧',
    title: 'Tool',
    description: 'Internal utility or helper function supporting operations',
    governance: [
      'Requires basic documentation of functionality',
      'Mandate: Data access controls if handling sensitive data',
      'Implement basic logging for troubleshooting',
      'Annual utility review recommended',
      'Standard change management applies',
    ],
  },
  mvp: {
    icon: '🧪',
    title: 'MVP',
    description: 'Early-stage experimental or pilot solution',
    governance: [
      'Requires owner acknowledgment of experimental status',
      'Mandate: Clear graduation criteria to production',
      'Implement basic monitoring and success metrics',
      'Quarterly milestone review required',
      'Timeline for full assessment or sunset must be defined',
    ],
  },
  product: {
    icon: '📦',
    title: 'Product',
    description: 'Packaged offering designed for external use or strategic value',
    governance: [
      'Requires full governance review and compliance audit',
      'Mandate: Product manager ownership and SLA definition',
      'Implement comprehensive monitoring and health checks',
      'Quarterly business review required',
      'Must have security certification and customer support plan',
    ],
  },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') || 'tool') as Category;
  const answersStr = searchParams.get('answers');
  const answers = answersStr ? JSON.parse(decodeURIComponent(answersStr)) : {};

  const info = categoryInfo[category];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Classification Results</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{answers.q1 || 'AI Solution'}</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Main Result */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '40px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{info.icon}</div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 12px' }}>
            {info.title}
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 24px', lineHeight: '1.6' }}>
            {info.description}
          </p>
          <div
            style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Category: {category.toUpperCase()}
          </div>
        </div>

        {/* Solution Summary */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px' }}>Solution Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Solution Name</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q1}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Owner</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q2}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>Department</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.department}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px' }}>LLM Used</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{(answers.q12 || []).join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Governance Requirements */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px' }}>Governance Requirements</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#5a5850', lineHeight: '1.8' }}>
            {info.governance.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', margin: '0 0 12px' }}>Next Steps</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#0369a1', lineHeight: '1.8' }}>
            <li>Ensure owner has reviewed and approved classification</li>
            <li>Schedule governance review with appropriate stakeholders</li>
            <li>Document any exceptions or deviations from standard governance</li>
            <li>Begin implementation with governance requirements in mind</li>
            <li>Set review cadence based on category (quarterly/annually)</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/register/intro"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: 'white',
              color: '#1e3a8a',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Register Another
          </Link>
          <Link
            href="/dashboard"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
