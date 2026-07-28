'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Category = 'agent' | 'workflow' | 'tool' | 'mvp' | 'product' | null;

// PHASE 1: 7 Classification Questions
const classificationQuestions = [
  { id: 'c1', label: '1. Does it operate autonomously or does it need human orchestration for each step?', type: 'radio', options: ['Operates autonomously', 'Needs human orchestration'] },
  { id: 'c2', label: '2. Does it make decisions/take actions or mainly provide information?', type: 'radio', options: ['Makes decisions/takes actions', 'Provides information only'] },
  { id: 'c3', label: '3. Is it end-user/customer-facing or internal utility?', type: 'radio', options: ['End-user/customer-facing', 'Internal utility'] },
  { id: 'c4', label: '4. Is it a standalone packaged offering or a support tool for operations?', type: 'radio', options: ['Standalone offering', 'Support tool'] },
  { id: 'c5', label: '5. Is it production-ready or still experimental/MVP?', type: 'radio', options: ['Production-ready', 'Experimental/MVP'] },
  { id: 'c6', label: '6. Does it coordinate multiple systems/tools or work independently?', type: 'radio', options: ['Coordinates multiple systems', 'Works independently'] },
  { id: 'c7', label: '7. Is it designed to be reused across use cases or built for one specific case?', type: 'radio', options: ['Designed for reuse', 'One specific use case'] },
];

// PHASE 2: 18 Detailed Questions (for Tool/MVP/Product only)
const detailedQuestions = [
  { id: 'd1', label: '8. What is the primary business value?', type: 'textarea' },
  { id: 'd2', label: '9. How many users/teams currently use this?', type: 'text' },
  { id: 'd3', label: '10. Is it integrated with other internal systems?', type: 'radio', options: ['Yes', 'No', 'Planned'] },
  { id: 'd4', label: '11. What data does it access or process?', type: 'checkboxes', options: ['Public', 'Internal', 'Confidential', 'Client', 'Personal', 'Financial'] },
  { id: 'd5', label: '12. Does it log actions/outputs for audit trail?', type: 'radio', options: ['Yes', 'No', 'Partial'] },
  { id: 'd6', label: '13. Has it been reviewed by legal/compliance/security?', type: 'checkboxes', options: ['Legal', 'Compliance', 'Security', 'Privacy', 'Risk', 'None yet'] },
  { id: 'd7', label: '14. What is the blast radius if it fails?', type: 'radio', options: ['Minor', 'Moderate', 'Severe', 'Critical'] },
  { id: 'd8', label: '15. Can it be turned off without major business disruption?', type: 'radio', options: ['Yes', 'No', 'Uncertain'] },
  { id: 'd9', label: '16. Is there documented governance/ownership?', type: 'radio', options: ['Yes', 'No', 'Partial'] },
  { id: 'd10', label: '17. Does it send data to external vendors?', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
  { id: 'd11', label: '18. Is there a rollback/exit strategy?', type: 'radio', options: ['Yes', 'No', 'Uncertain'] },
  { id: 'd12', label: '19. How is it monitored/maintained?', type: 'textarea' },
  { id: 'd13', label: '20. Are there any known technical debt or limitations?', type: 'textarea' },
  { id: 'd14', label: '21. What is the update/change frequency?', type: 'radio', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
  { id: 'd15', label: '22. Is cost/performance tracking in place?', type: 'radio', options: ['Yes', 'No', 'Partial'] },
  { id: 'd16', label: '23. Are there retention policies for logs/outputs?', type: 'radio', options: ['Yes', 'No', 'Unclear'] },
  { id: 'd17', label: '24. Has it been stress-tested or load-tested?', type: 'radio', options: ['Yes', 'No', 'Partial'] },
  { id: 'd18', label: '25. What exceptions or deviations have been approved?', type: 'text' },
];

function classifyCategory(answers: Record<string, string>): Category {
  const c1 = answers.c1; // autonomous vs orchestration
  const c2 = answers.c2; // decisions vs info
  const c3 = answers.c3; // end-user vs internal
  const c4 = answers.c4; // standalone vs support
  const c5 = answers.c5; // production vs experimental
  const c6 = answers.c6; // coordinates vs independent
  const c7 = answers.c7; // reuse vs specific

  // AGENT: autonomous + makes decisions + takes actions
  if (c1 === 'Operates autonomously' && c2 === 'Makes decisions/takes actions') {
    return 'agent';
  }

  // WORKFLOW: needs orchestration + coordinates systems
  if (c1 === 'Needs human orchestration' && c6 === 'Coordinates multiple systems') {
    return 'workflow';
  }

  // PRODUCT: end-user facing + standalone + production ready
  if (c3 === 'End-user/customer-facing' && c4 === 'Standalone offering' && c5 === 'Production-ready') {
    return 'product';
  }

  // MVP: experimental/early stage
  if (c5 === 'Experimental/MVP') {
    return 'mvp';
  }

  // TOOL: internal utility (default for non-Agent/Workflow)
  return 'tool';
}

function ClassificationPhase({ answers, setAnswers, onComplete }: any) {
  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev: any) => ({ ...prev, [id]: value }));
  };

  const allAnswered = classificationQuestions.every((q) => answers[q.id]);
  const category = classifyCategory(answers);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 20px', color: '#1e293b' }}>
          Phase 1: What is it? (7 Questions)
        </h2>

        {classificationQuestions.map((q) => (
          <div key={q.id} style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
              {q.label}
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(q.id, opt)}
                  style={{
                    border: answers[q.id] === opt ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: answers[q.id] === opt ? '#3b82f6' : 'white',
                    color: answers[q.id] === opt ? 'white' : '#5a5850',
                    fontWeight: answers[q.id] === opt ? '600' : '400',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allAnswered && category && (
        <div style={{ padding: '16px', backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '600', marginBottom: '6px' }}>Classified as:</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
            {category === 'agent' ? '🤖 Agent' : category === 'workflow' ? '⚙️ Workflow' : category === 'product' ? '📦 Product' : category === 'mvp' ? '🧪 MVP' : '🔧 Tool'}
          </div>
          {(category === 'agent' || category === 'workflow') && (
            <p style={{ fontSize: '11px', color: '#0369a1', margin: '8px 0 0' }}>
              ✓ Classification complete! This is a {category}. No further details needed.
            </p>
          )}
          {!['agent', 'workflow'].includes(category) && (
            <p style={{ fontSize: '11px', color: '#0369a1', margin: '8px 0 0' }}>
              Continue to Phase 2 for detailed governance questions →
            </p>
          )}
        </div>
      )}

      {allAnswered && (
        <button
          onClick={() => onComplete(category)}
          style={{
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: ['agent', 'workflow'].includes(category!) ? '#10b981' : '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {['agent', 'workflow'].includes(category!) ? '✓ Complete' : 'Continue to Phase 2 →'}
        </button>
      )}
    </div>
  );
}

function DetailedPhase({ category, answers, setAnswers, onBack, onComplete }: any) {
  const handleAnswer = (id: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 20px', color: '#1e293b' }}>
          Phase 2: Deep Dive (18 Questions for {category})
        </h2>

        {detailedQuestions.map((q) => (
          <div key={q.id} style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
              {q.label}
            </label>

            {q.type === 'text' && (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '13px',
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
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '13px',
                  minHeight: '60px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            )}

            {q.type === 'radio' && q.options && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    style={{
                      border: answers[q.id] === opt ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
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

            {q.type === 'checkboxes' && q.options && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {q.options.map((opt) => {
                  const selected = (answers[q.id] || []).includes(opt);
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
                        border: selected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: selected ? '#3b82f6' : 'white',
                        color: selected ? 'white' : '#5a5850',
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => onComplete(category)}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          View Results →
        </button>
      </div>
    </div>
  );
}

function SmartFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<'classification' | 'detailed' | 'complete'>('classification');
  const [category, setCategory] = useState<Category>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q1: searchParams.get('q1') || '',
    q2: searchParams.get('q2') || '',
    department: searchParams.get('department') || '',
    q12: searchParams.get('q12') ? [searchParams.get('q12')] : [],
  });

  const handleClassificationComplete = (cat: Category) => {
    setCategory(cat);
    if (['agent', 'workflow'].includes(cat!)) {
      // Agent/Workflow: skip detailed phase and go to logic breakdown
      router.push(`/register/logic-breakdown?category=${cat}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    } else {
      // Tool/MVP/Product: proceed to detailed questions
      setPhase('detailed');
    }
  };

  const handleDetailedComplete = () => {
    router.push(`/register/logic-breakdown?category=${category}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>AI Solution Intake</h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              {answers.q1 && `${answers.q1} • `}
              {phase === 'classification' ? 'Phase 1: Classification (7 questions)' : `Phase 2: Deep Dive (18 questions)`}
            </p>
          </div>
          <a href="/admin/logic" style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            height: 'fit-content'
          }}>
            📋 Reference Logic
          </a>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px' }}>
          {phase === 'classification' && (
            <ClassificationPhase answers={answers} setAnswers={setAnswers} onComplete={handleClassificationComplete} />
          )}

          {phase === 'detailed' && (
            <DetailedPhase
              category={category}
              answers={answers}
              setAnswers={setAnswers}
              onBack={() => setPhase('classification')}
              onComplete={handleDetailedComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SmartFormPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
      <SmartFormContent />
    </Suspense>
  );
}
