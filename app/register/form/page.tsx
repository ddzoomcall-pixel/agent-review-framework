'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TierType = 'low' | 'review' | 'escalate' | 'unknown' | 'na' | 'pending';

interface TierResult {
  tier: TierType;
  label: string;
  reasons: string[];
}

const SENSITIVE_DATA = ['Confidential', 'Client', 'Personal', 'Deal', 'Financial', 'Legal', 'MNPI'];

const sections = [
  {
    title: 'Ownership & purpose',
    questions: [
      { id: 'q1', label: '1. Solution name', why: 'Creates the registry record.', type: 'text' },
      { id: 'q2', label: '2. Business owner', why: 'Ensures accountability.', type: 'text' },
      { id: 'q3', label: '3. Technical owner / builder', why: 'Ensures someone can explain and support it.', type: 'text' },
      { id: 'q4', label: '4. What business problem does it solve?', why: 'Clarifies purpose and expected output.', type: 'textarea' },
    ],
  },
  {
    title: 'Client & data exposure',
    questions: [
      { id: 'q5', label: '5. Is it used for internal work, client work, or both?', why: 'Client exposure raises governance needs.', type: 'radio', options: ['Internal only', 'Client work', 'Both'] },
      { id: 'q6', label: '6. How many clients can it touch?', why: 'Multiple-client use increases confidentiality and segregation risk.', type: 'radio', options: ['One', 'Multiple', 'Unknown'] },
      { id: 'q7', label: '7. Does it reuse inputs, prompts, outputs, or templates across clients?', why: 'Cross-client reuse can create contamination risk.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
      { id: 'q8', label: '8. What data types does it use?', why: 'Data classification drives control requirements.', type: 'checkboxes', options: ['Public', 'Internal', 'Confidential', 'Client', 'Personal', 'Deal', 'Financial', 'Legal', 'MNPI'] },
      { id: 'q9', label: '9. Does it access raw client data, masked data, or synthetic data only?', why: 'Raw data implies much higher control needs.', type: 'radio', options: ['Raw client data', 'Masked data', 'Synthetic data only', 'Mixed'] },
      { id: 'q10', label: '10. Does it process data for one client at a time or commingle data from multiple clients?', why: 'Commingling is a major segregation risk.', type: 'radio', options: ['One client at a time', 'Commingled across clients', 'Not applicable — internal only'] },
    ],
  },
  {
    title: 'Systems & AI stack',
    questions: [
      { id: 'q11', label: '11. Does it connect to internal systems, email, drives, databases, APIs, or spreadsheets?', why: 'Integration depth increases risk and review scope.', type: 'checkboxes', options: ['Internal systems', 'Email', 'Drives', 'Databases', 'APIs', 'Spreadsheets', 'None'] },
      { id: 'q12', label: '12. What AI tools or models does it use?', why: 'Identifies the actual AI stack in use.', type: 'checkboxes', options: ['Approved LLMs', 'Unapproved LLMs', 'Copilots', 'Agent platforms', 'Plugins', 'OCR', 'RPA', 'Search tools', 'None'] },
      { id: 'q13', label: '13. Does it use more than one AI tool or model?', why: 'Multiple tools increase complexity and data exposure.', type: 'radio', options: ['Yes', 'No'] },
      { id: 'q14', label: '14. Does it send prompts or data to an external vendor?', why: 'External transmission matters for confidentiality and vendor risk.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
      { id: 'q15', label: '15. Does any vendor retain, train on, or log your inputs or outputs?', why: 'Data retention/training is a critical control question.', type: 'radio', options: ['Yes', 'No', 'Unknown', 'Not applicable'] },
    ],
  },
  {
    title: 'Output & autonomy',
    questions: [
      { id: 'q16', label: '16. Does it generate analysis, summaries, emails, reports, slides, code, or recommendations?', why: 'Determines if output may be relied upon.', type: 'checkboxes', options: ['Analysis', 'Summaries', 'Emails', 'Reports', 'Slides', 'Code', 'Recommendations', 'Other'] },
      { id: 'q17', label: '17. Can the output influence investment, diligence, valuation, compliance, legal, or client decisions?', why: 'Decision impact affects approval level.', type: 'radio', options: ['Yes', 'No'] },
      { id: 'q18', label: '18. Does it take action automatically (sending, updating, posting, approving, triggering workflows)?', why: 'Autonomy changes control severity.', type: 'radio', options: ['Yes', 'No'] },
      { id: 'q19', label: '19. Is human review mandatory before use, or optional?', why: 'Human oversight is a key governance control.', type: 'radio', options: ['Mandatory', 'Optional', 'None'] },
    ],
  },
  {
    title: 'Lifecycle & access',
    questions: [
      { id: 'q20', label: '20. Is the solution experimental, pilot, MVP, or already in production?', why: 'Lifecycle stage determines governance rigor.', type: 'radio', options: ['Experimental', 'Pilot', 'MVP', 'Production'] },
      { id: 'q21', label: '21. How many users access it, and from which teams or geographies?', why: 'Broader access means broader exposure.', type: 'textarea' },
      { id: 'q22', label: '22. Are contractors, offshore teams, or third parties involved?', why: 'Third-party access affects controls and ownership.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
      { id: 'q23', label: '23. Can it be turned off or rolled back without business disruption?', why: 'Exit and fallback planning matter for operational resilience.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
    ],
  },
  {
    title: 'Governance & controls',
    questions: [
      { id: 'q24', label: '24. Are logs kept for prompts, outputs, access, and actions?', why: 'Auditability is essential for review and investigations.', type: 'checkboxes', options: ['Prompts', 'Outputs', 'Access', 'Actions', 'None'] },
      { id: 'q25', label: '25. Has legal, compliance, security, privacy, or risk reviewed it?', why: 'Confirms governance sign-off.', type: 'checkboxes', options: ['Legal', 'Compliance', 'Security', 'Privacy', 'Risk', 'None yet'] },
      { id: 'q26', label: '26. Are there any client-specific restrictions, confidentiality obligations, or wall-crossing issues?', why: 'Critical for financial services and multi-client firms.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
      { id: 'q27', label: '27. Can the solution be reused for another client without reconfiguration?', why: 'Reuse can create accidental leakage across clients.', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
      { id: 'q28', label: '28. Is there a documented purpose limitation for the data used?', why: 'Prevents scope creep in AI use.', type: 'radio', options: ['Yes', 'No'] },
      { id: 'q29', label: '29. What is the worst plausible harm if the output is wrong or leaked?', why: 'Drives risk rating.', type: 'textarea' },
      { id: 'q30', label: '30. What exception, if any, has been approved?', why: 'Tracks policy deviations and temporary approvals.', type: 'text' },
    ],
  },
];

function computeTier(answers: Record<string, any>): TierResult {
  const reasons: string[] = [];

  const q12 = answers.q12 || [];
  if (q12.length === 0) {
    return { tier: 'pending', label: 'Incomplete — answer Q12 to classify', reasons: [] };
  }
  if (q12.length === 1 && q12[0] === 'None') {
    return { tier: 'na', label: 'Not applicable — no AI tool in use', reasons: ['Q12: no AI tool or model selected.'] };
  }

  if (answers.q14 === 'Yes') reasons.push('Q14: sends prompts or data to an external AI vendor.');
  if (answers.q15 === 'Yes') reasons.push('Q15: a vendor retains, trains on, or logs inputs/outputs.');
  if (answers.q13 === 'Yes') reasons.push('Q13: more than one AI tool or model is in use.');
  if (answers.q18 === 'Yes') reasons.push('Q18: the solution takes action automatically.');

  if (reasons.length > 0) {
    return { tier: 'escalate', label: 'Escalate — formal approval required', reasons };
  }

  const dataFlags = (answers.q8 || []).filter((d: string) => SENSITIVE_DATA.includes(d));
  if (dataFlags.length) reasons.push('Q8: touches ' + dataFlags.join(', ') + ' data.');
  if (answers.q6 === 'Multiple') reasons.push('Q6: can touch multiple clients.');
  if (answers.q6 === 'Unknown') reasons.push('Q6: number of clients touched is unknown.');
  if (answers.q10 === 'Commingled across clients') reasons.push('Q10: commingles data across clients.');
  if (answers.q7 === 'Yes') reasons.push('Q7: reuses inputs/outputs/templates across clients.');
  if (answers.q26 === 'Yes') reasons.push('Q26: client-specific restrictions or wall-crossing issues flagged.');
  if (answers.q9 === 'Raw client data') reasons.push('Q9: accesses raw client data.');

  if (reasons.length > 0) {
    return { tier: 'review', label: 'Review required', reasons };
  }

  return { tier: 'low', label: 'Low risk', reasons: ['Public/synthetic data only, no flagged integrations or cross-client exposure detected.'] };
}

function FormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [tierResult, setTierResult] = useState<TierResult>({ tier: 'pending', label: 'Answer questions to compute tier', reasons: [] });
  const [currentSection, setCurrentSection] = useState(0);

  // Initialize from query params (intro page data)
  useEffect(() => {
    const initialAnswers: Record<string, any> = { ...answers };
    if (searchParams.get('q1')) initialAnswers.q1 = searchParams.get('q1');
    if (searchParams.get('q2')) initialAnswers.q2 = searchParams.get('q2');
    if (searchParams.get('department')) initialAnswers.department = searchParams.get('department');
    if (searchParams.get('q12')) initialAnswers.q12 = [searchParams.get('q12')];

    if (Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, []);

  useEffect(() => {
    const newTier = computeTier(answers);
    setTierResult(newTier);
  }, [answers]);

  const handleAnswer = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const tierColors: Record<TierType, { bg: string; color: string }> = {
    low: { bg: '#e1f5ee', color: '#0f6e56' },
    review: { bg: '#faeeda', color: '#854f0b' },
    escalate: { bg: '#fcebeb', color: '#a32d2d' },
    unknown: { bg: '#e2e0da', color: '#2c2c2a' },
    na: { bg: '#f1efe8', color: '#5f5e5a' },
    pending: { bg: '#f0f4f8', color: '#64748b' },
  };

  const colors = tierColors[tierResult.tier];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>AI Solution Intake Questionnaire</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9' }}>
          {answers.q1 ? `${answers.q1} • ` : ''}Section {currentSection + 1} of {sections.length}
        </p>
      </div>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Tier Banner */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', position: 'sticky', top: '20px', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#1e293b' }}>Computed Risk Tier</strong>
            <span style={{ fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '999px', background: colors.bg, color: colors.color }}>
              {tierResult.label}
            </span>
          </div>
          {tierResult.reasons.length > 0 && (
            <ul style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0', paddingLeft: '18px' }}>
              {tierResult.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          {sections.map((sec, i) => (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: currentSection === i ? '#1e3a8a' : '#64748b',
                fontWeight: currentSection === i ? '600' : '400',
                borderBottom: currentSection === i ? '2px solid #3b82f6' : '2px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 20px', color: '#1e293b' }}>
            {sections[currentSection].title}
          </h2>

          {sections[currentSection].questions.map((q: any) => (
            <div key={q.id} style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '3px', display: 'block' }}>
                {q.label}
              </label>
              <div style={{ fontSize: '12px', color: '#8a8880', marginBottom: '8px' }}>{q.why}</div>

              {q.type === 'text' && (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #c9c6bd',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #c9c6bd',
                    borderRadius: '10px',
                    fontSize: '14px',
                    minHeight: '56px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              )}

              {q.type === 'radio' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      style={{
                        border: answers[q.id] === opt ? '2px solid #3b82f6' : '1px solid #c9c6bd',
                        borderRadius: '999px',
                        padding: '6px 13px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: answers[q.id] === opt ? '#3b82f6' : 'white',
                        color: answers[q.id] === opt ? 'white' : '#5a5850',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'checkboxes' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {q.options.map((opt: string) => {
                    const isSelected = (answers[q.id] || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const current = new Set(answers[q.id] || []);
                          if (current.has(opt)) current.delete(opt);
                          else current.add(opt);
                          handleAnswer(q.id, Array.from(current));
                        }}
                        style={{
                          border: isSelected ? '2px solid #3b82f6' : '1px solid #c9c6bd',
                          borderRadius: '999px',
                          padding: '6px 13px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          background: isSelected ? '#3b82f6' : 'white',
                          color: isSelected ? 'white' : '#5a5850',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            style={{
              padding: '10px 16px',
              border: '1px solid #c9c6bd',
              borderRadius: '10px',
              background: currentSection === 0 ? '#f1efe8' : 'white',
              cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSection === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #c9c6bd',
              borderRadius: '10px',
              background: currentSection === sections.length - 1 ? '#f1efe8' : 'white',
              cursor: currentSection === sections.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentSection === sections.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </button>
          <button
            onClick={() => router.push(`/register/tiering-output?answers=${encodeURIComponent(JSON.stringify(answers))}`)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '10px',
              background: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              marginLeft: 'auto',
              fontWeight: '600',
            }}
          >
            View Tiering Output →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading questionnaire...</div>}>
      <FormPageContent />
    </Suspense>
  );
}
