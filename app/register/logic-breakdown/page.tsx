'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Category = 'agent' | 'workflow' | 'tool' | 'mvp' | 'product';

const classificationLogic: Record<Category, {
  icon: string;
  title: string;
  description: string;
  triggers: string[];
  antiPatterns: string[];
  governance: string[];
}> = {
  agent: {
    icon: '🤖',
    title: 'Agent',
    description: 'Autonomous system that makes decisions and takes independent actions without human approval per action',
    triggers: [
      '✓ Operates autonomously (not human-orchestrated)',
      '✓ Makes decisions/takes actions (not just informational)',
    ],
    antiPatterns: [
      'Cannot be classified as Workflow if it needs orchestration',
      'Must not rely on human review for every single action',
    ],
    governance: [
      'Formal governance approval required before production',
      'Mandate: Human-in-the-loop review for autonomous actions',
      'Comprehensive audit logging of all decisions',
      'Quarterly security and governance review',
      'Kill-switch and rollback capability mandatory',
      'Executive sponsor required',
    ],
  },
  workflow: {
    icon: '⚙️',
    title: 'Workflow',
    description: 'Orchestration system that coordinates multiple tools and systems in predefined sequences',
    triggers: [
      '✓ Needs human orchestration/triggering',
      '✓ Coordinates multiple systems (not standalone)',
    ],
    antiPatterns: [
      'Cannot be Agent if it requires human orchestration',
      'Must coordinate more than one system or tool',
    ],
    governance: [
      'Process documentation and owner sign-off',
      'Integration testing with all connected systems',
      'Error handling and fallback procedures',
      'Annual process and integration review',
      'Audit trail of all workflow executions',
      'Change management for workflow modifications',
    ],
  },
  tool: {
    icon: '🔧',
    title: 'Tool',
    description: 'Internal utility or helper function supporting operations and internal processes',
    triggers: [
      '✓ Internal utility (not end-user facing)',
      '✓ Support function (not standalone offering)',
      '✓ Not classified as Agent or Workflow',
    ],
    antiPatterns: [
      'Cannot be end-user facing (would be Product)',
      'Cannot be autonomous independent system (would be Agent)',
      'Cannot be orchestration system (would be Workflow)',
    ],
    governance: [
      'Basic documentation of functionality',
      'Data access controls for sensitive data',
      'Basic logging for troubleshooting',
      'Annual utility review',
      'Standard change management',
      'Owner designation required',
    ],
  },
  mvp: {
    icon: '🧪',
    title: 'MVP',
    description: 'Early-stage experimental or pilot solution testing concepts and gathering feedback',
    triggers: [
      '✓ Experimental or pilot stage (not production-ready)',
      'May later become Agent, Workflow, Tool, or Product',
    ],
    antiPatterns: [
      'Cannot be production-ready',
      'Must have clear graduation path or sunset plan',
    ],
    governance: [
      'Owner acknowledgment of experimental status',
      'Clear graduation criteria defined',
      'Basic monitoring and success metrics',
      'Quarterly milestone review',
      'Timeline for full assessment or sunset (max 12 months)',
      'Limited user scope during pilot phase',
    ],
  },
  product: {
    icon: '📦',
    title: 'Product',
    description: 'Packaged offering designed for external/customer use or strategic business value',
    triggers: [
      '✓ End-user/customer-facing',
      '✓ Standalone offering (not just support)',
      '✓ Production-ready',
    ],
    antiPatterns: [
      'Cannot be internal-only utility (would be Tool)',
      'Cannot be experimental (would be MVP)',
      'Must have customer/strategic value',
    ],
    governance: [
      'Full governance review and compliance audit',
      'Product manager ownership and SLA definition',
      'Comprehensive monitoring and health checks',
      'Quarterly business review',
      'Security certification required',
      'Customer support plan mandatory',
      'Performance SLAs and uptime guarantees',
    ],
  },
};

const questionLabels: Record<string, string> = {
  c1: 'Autonomy',
  c2: 'Decision-Making',
  c3: 'Audience',
  c4: 'Offering Type',
  c5: 'Lifecycle Stage',
  c6: 'System Coordination',
  c7: 'Reusability',
};

function LogicBreakdownContent() {
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') || 'tool') as Category;
  const answersStr = searchParams.get('answers');
  const answers = answersStr ? JSON.parse(decodeURIComponent(answersStr)) : {};

  const info = classificationLogic[category];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Classification Logic Breakdown</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{answers.q1 || 'AI Solution'}</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Main Classification */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '40px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
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

        {/* Classification Logic */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>
            Why this classification?
          </h3>

          {/* Triggers */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '12px', margin: '0 0 12px' }}>
              ✓ Classification Triggers
            </h4>
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#0369a1', lineHeight: '1.8' }}>
                {info.triggers.map((trigger, i) => (
                  <li key={i}>{trigger}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decision Logic */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', textTransform: 'uppercase', marginBottom: '12px' }}>
              Decision Logic
            </h4>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#0c2340', lineHeight: '1.8' }}>
              <p style={{ margin: '0 0 12px' }}>
                Based on your answers to the classification questions:
              </p>
              <ul style={{ margin: '0 0 12px', paddingLeft: '20px' }}>
                {Object.entries(answers)
                  .filter(([key]) => key.startsWith('c'))
                  .map(([key, value]) => (
                    <li key={key}>
                      <strong>{questionLabels[key]}:</strong> {value}
                    </li>
                  ))}
              </ul>
              <p style={{ margin: '0' }}>
                These answers meet the criteria for classification as a <strong>{info.title}</strong>.
              </p>
            </div>
          </div>

          {/* Anti-Patterns */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', marginBottom: '12px' }}>
              🚫 Not This Category If
            </h4>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#991b1b', lineHeight: '1.8' }}>
                {info.antiPatterns.map((pattern, i) => (
                  <li key={i}>{pattern}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>
            Governance Requirements for {info.title}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {info.governance.map((req, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#475569',
                  lineHeight: '1.6',
                }}
              >
                <span style={{ fontWeight: '600', color: '#1e293b' }}>•</span> {req}
              </div>
            ))}
          </div>
        </div>

        {/* Solution Details */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>
            Your Solution
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px', fontWeight: '600' }}>Name</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q1}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px', fontWeight: '600' }}>Owner</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.q2}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px', fontWeight: '600' }}>Department</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{answers.department}</div>
            </div>
            <div>
              <div style={{ color: '#8a8880', marginBottom: '4px', fontWeight: '600' }}>LLM</div>
              <div style={{ color: '#1e293b', fontWeight: '500' }}>{(answers.q12 || []).join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', margin: '0 0 16px' }}>
            🎯 Next Steps
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#0369a1', lineHeight: '1.8' }}>
            <li>Ensure owner has reviewed and approved this classification</li>
            <li>Schedule governance review with appropriate stakeholders</li>
            <li>Document any exceptions or deviations from standard requirements</li>
            <li>Begin implementation with governance requirements in mind</li>
            <li>Set review cadence: {category === 'agent' ? 'Quarterly' : category === 'product' ? 'Quarterly' : 'Annual'}</li>
          </ol>
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

export default function LogicBreakdownPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading logic breakdown...</div>}>
      <LogicBreakdownContent />
    </Suspense>
  );
}
