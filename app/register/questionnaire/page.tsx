'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function QuestionnaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = (searchParams.get('tier') ?? 'light_touch') as 'light_touch' | 'full_review';

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    team: '',
    provider: '',
    description: '',
    dataHandled: '',
    autonomous: false,
    financial: false,
    clientFacing: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      tier: tier === 'full_review' ? 'Full-review' : 'Light-touch',
      classification: formData.provider,
      id: `agent-${Date.now()}`,
    });
    router.push(`/register/confirmation?${params.toString()}`);
  };

  const isFullReview = tier === 'full_review';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>
          {isFullReview ? 'Full-Review Questionnaire' : 'Light-Touch Questionnaire'}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          {isFullReview ? 'Comprehensive governance assessment' : 'Quick compliance check'}
        </p>
      </div>

      <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            {/* Basic Info */}
            <h2 style={{ fontSize: '16px', color: '#1e3a8a', margin: '0 0 20px', fontWeight: '600' }}>Agent Information</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                Agent Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Portfolio Analyzer"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Your name"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                Team *
              </label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="Your team"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                LLM Provider *
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select provider...</option>
                <option value="Claude">Claude</option>
                <option value="GPT-4">GPT-4</option>
                <option value="Gemini">Gemini</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                Brief Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this agent do?"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Full-Review Specific Questions */}
            {isFullReview && (
              <>
                <hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />
                <h2 style={{ fontSize: '16px', color: '#1e3a8a', margin: '0 0 20px', fontWeight: '600' }}>Risk Assessment</h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>
                    What type of data does it handle?
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Customer PII', 'Financial Data', 'Trade Data', 'Internal Only', 'Public Data'].map((option) => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.dataHandled.includes(option)}
                          onChange={(e) => {
                            const current = formData.dataHandled ? formData.dataHandled.split(',') : [];
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter((item) => item !== option);
                            setFormData({ ...formData, dataHandled: updated.join(',') });
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                    <input
                      type="checkbox"
                      checked={formData.autonomous}
                      onChange={(e) => setFormData({ ...formData, autonomous: e.target.checked })}
                    />
                    Takes autonomous actions (no human approval per action)
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                    <input
                      type="checkbox"
                      checked={formData.financial}
                      onChange={(e) => setFormData({ ...formData, financial: e.target.checked })}
                    />
                    Affects financial decisions or valuations
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                    <input
                      type="checkbox"
                      checked={formData.clientFacing}
                      onChange={(e) => setFormData({ ...formData, clientFacing: e.target.checked })}
                    />
                    Client-facing or used in marketing
                  </label>
                </div>
              </>
            )}

            {!isFullReview && (
              <>
                <hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />
                <div style={{ padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '12px', color: '#0369a1', marginBottom: '20px' }}>
                  ℹ️ Light-touch agents are auto-approved if they're MVP, experimental, or handle only public data.
                </div>
              </>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              Submit Registration
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center' }}>
          <a href="/register/choose" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
            ← Change tier
          </a>
        </div>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionnaireContent />
    </Suspense>
  );
}
