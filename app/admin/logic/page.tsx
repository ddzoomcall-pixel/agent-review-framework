'use client';

import { useState } from 'react';
import Link from 'next/link';

type Category = 'agent' | 'workflow' | 'tool' | 'mvp' | 'product';

const categories: Category[] = ['agent', 'workflow', 'tool', 'mvp', 'product'];

const logicDefinitions: Record<Category, {
  icon: string;
  title: string;
  description: string;
  color: { bg: string; border: string; text: string };
  triggers: string[];
  antiPatterns: string[];
  governance: string[];
  reviewCadence: string;
  approvalLevel: string;
}> = {
  agent: {
    icon: '🤖',
    title: 'Agent',
    description: 'Autonomous system that makes decisions and takes independent actions without human approval per action',
    color: { bg: '#eff6ff', border: '#bae6fd', text: '#0369a1' },
    triggers: [
      'Operates autonomously (not human-orchestrated)',
      'Makes decisions/takes actions (not just informational)',
      'Takes independent actions without human approval per action',
    ],
    antiPatterns: [
      '❌ Cannot be classified if it requires human orchestration for each step',
      '❌ Cannot be classified if it only provides information',
      '❌ Must not rely on human review for every single action',
    ],
    governance: [
      'Formal governance approval required before production',
      'Mandate: Human-in-the-loop review for autonomous actions',
      'Comprehensive audit logging of all decisions and actions',
      'Quarterly security and governance review',
      'Kill-switch and rollback capability mandatory',
      'Executive sponsor required',
      'Risk assessment and impact analysis required',
      'Liability and accountability framework defined',
    ],
    reviewCadence: 'Quarterly',
    approvalLevel: 'Executive/CRO',
  },
  workflow: {
    icon: '⚙️',
    title: 'Workflow',
    description: 'Orchestration system that coordinates multiple tools and systems in predefined sequences',
    color: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    triggers: [
      'Needs human orchestration/triggering (not autonomous)',
      'Coordinates multiple systems or tools',
      'Executes predefined steps in sequence',
    ],
    antiPatterns: [
      '❌ Cannot be classified if it operates autonomously',
      '❌ Cannot be classified if it only works independently',
      '❌ Must coordinate more than one system or tool',
    ],
    governance: [
      'Process documentation and owner sign-off',
      'Integration testing with all connected systems',
      'Error handling and fallback procedures defined',
      'Annual process and integration review',
      'Audit trail of all workflow executions',
      'Change management for workflow modifications',
      'Disaster recovery and business continuity plan',
      'SLA definition for workflow completion',
    ],
    reviewCadence: 'Annual',
    approvalLevel: 'Department Head',
  },
  tool: {
    icon: '🔧',
    title: 'Tool',
    description: 'Internal utility or helper function supporting operations and internal processes',
    color: { bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8' },
    triggers: [
      'Internal utility (not end-user facing)',
      'Support function (not standalone offering)',
      'Helps operations but not core to business',
    ],
    antiPatterns: [
      '❌ Cannot be classified if it is end-user facing',
      '❌ Cannot be classified if it is autonomous independent system',
      '❌ Cannot be classified if it is orchestration system',
    ],
    governance: [
      'Basic documentation of functionality',
      'Data access controls for sensitive data',
      'Basic logging for troubleshooting and audits',
      'Annual utility review',
      'Standard change management process',
      'Owner designation and backup owner',
      'Maintenance and support plan',
      'Deprecation policy if tool becomes obsolete',
    ],
    reviewCadence: 'Annual',
    approvalLevel: 'Team Lead',
  },
  mvp: {
    icon: '🧪',
    title: 'MVP',
    description: 'Early-stage experimental or pilot solution testing concepts and gathering feedback',
    color: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
    triggers: [
      'Experimental or pilot stage (not production-ready)',
      'Testing new concepts or approaches',
      'Gathering user feedback before full deployment',
    ],
    antiPatterns: [
      '❌ Cannot be classified if it is production-ready',
      '❌ Cannot be deployed at scale without graduation plan',
      '❌ Must have clear criteria for graduation or sunset',
    ],
    governance: [
      'Owner acknowledgment of experimental status',
      'Clear graduation criteria and timeline defined',
      'Basic monitoring and success metrics',
      'Quarterly milestone review',
      'Timeline for full assessment or sunset (max 12 months)',
      'Limited user scope during pilot phase',
      'Risk mitigation plan for pilot failures',
      'Data retention and cleanup plan',
    ],
    reviewCadence: 'Quarterly',
    approvalLevel: 'Product Manager',
  },
  product: {
    icon: '📦',
    title: 'Product',
    description: 'Packaged offering designed for external/customer use or strategic business value',
    color: { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' },
    triggers: [
      'End-user/customer-facing',
      'Standalone offering (not just internal support)',
      'Production-ready and deployed at scale',
      'Strategic business value and revenue impact',
    ],
    antiPatterns: [
      '❌ Cannot be classified if it is internal-only utility',
      '❌ Cannot be classified if it is experimental or MVP',
      '❌ Must have demonstrated customer/business value',
    ],
    governance: [
      'Full governance review and compliance audit',
      'Product manager ownership and accountability',
      'Comprehensive monitoring and health checks',
      'Quarterly business review and success metrics',
      'Security certification and penetration testing',
      'Customer support plan and SLA mandatory',
      'Performance SLAs and uptime guarantees',
      'Disaster recovery and business continuity certified',
      'Privacy and data protection compliance',
      'Release management and versioning',
    ],
    reviewCadence: 'Quarterly',
    approvalLevel: 'VP/Executive',
  },
};

export default function LogicReferencePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const displayCategories = selectedCategory === 'all' ? categories : [selectedCategory as Category];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Classification Logic Reference</h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Admin guide to AI solution categorization</p>
          </div>
          <Link
            href="/dashboard"
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', display: 'block' }}>
            Filter by category:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 16px',
                border: selectedCategory === 'all' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                backgroundColor: selectedCategory === 'all' ? '#3b82f6' : 'white',
                color: selectedCategory === 'all' ? 'white' : '#1e293b',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
              }}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  border: selectedCategory === cat ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: selectedCategory === cat ? '#3b82f6' : 'white',
                  color: selectedCategory === cat ? 'white' : '#1e293b',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '12px',
                }}
              >
                {logicDefinitions[cat].icon} {logicDefinitions[cat].title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 40px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {displayCategories.map((category) => {
          const logic = logicDefinitions[category];
          return (
            <div
              key={category}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: '24px',
                overflow: 'hidden',
              }}
            >
              {/* Category Header */}
              <div
                style={{
                  background: logic.color.bg,
                  borderBottom: `2px solid ${logic.color.border}`,
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ fontSize: '40px' }}>{logic.icon}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                    {logic.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: logic.color.text }}>{logic.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Review Cadence</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{logic.reviewCadence}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginTop: '8px', marginBottom: '4px' }}>
                    Approval Level
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>{logic.approvalLevel}</div>
                </div>
              </div>

              {/* Content Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  padding: '24px',
                }}
              >
                {/* Triggers */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', margin: '0 0 12px' }}>
                    ✓ Classification Triggers
                  </h3>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#475569', lineHeight: '1.8' }}>
                      {logic.triggers.map((trigger, i) => (
                        <li key={i}>{trigger}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Anti-Patterns */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '12px', margin: '0 0 12px' }}>
                    🚫 What Excludes This
                  </h3>
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '12px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#7f1d1d', lineHeight: '1.8' }}>
                      {logic.antiPatterns.map((pattern, i) => (
                        <li key={i}>{pattern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Governance */}
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px' }}>
                  📋 Governance Requirements
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {logic.governance.map((req, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
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
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '20px 40px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          Classification Logic Reference v1.0 • Last updated {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
