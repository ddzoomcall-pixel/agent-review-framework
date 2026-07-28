'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ClassificationType = 'agent' | 'workflow' | 'tool' | 'product' | null;

export default function ClassifyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({
    q1: null as boolean | null, // Makes autonomous decisions
    q2: null as boolean | null, // Customer-facing
    q3: null as boolean | null, // Multi-step orchestration
    q4: null as boolean | null, // Takes external actions
    q5: null as boolean | null, // Utility/helper
  });

  const [result, setResult] = useState<ClassificationType>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const classify = (a1: boolean | null, a2: boolean | null, a3: boolean | null, a4: boolean | null, a5: boolean | null): ClassificationType => {
    if ([a1, a2, a3, a4, a5].some((a) => a === null)) return null;

    // Agent: autonomous decisions + takes actions
    if (a1 === true && a4 === true) return 'agent';

    // Workflow: multi-step orchestration (regardless of autonomous)
    if (a3 === true) return 'workflow';

    // Product: customer-facing + provides value
    if (a2 === true) return 'product';

    // Internal Tool: utility/helper function
    if (a5 === true) return 'tool';

    // Default to tool if it's internal only
    if (a2 === false) return 'tool';

    return null;
  };

  const handleAnswer = (question: keyof typeof answers, value: boolean) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);

    const classification = classify(newAnswers.q1, newAnswers.q2, newAnswers.q3, newAnswers.q4, newAnswers.q5);
    setResult(classification);

    if (classification) {
      setShowExplanation(true);
    }
  };

  const getTypeInfo = (type: ClassificationType) => {
    const info = {
      agent: {
        title: '🤖 Agent',
        description: 'Autonomous decision-making system',
        details: 'Takes independent actions based on inputs, makes decisions without human approval per action, can operate continuously.',
        color: '#3b82f6',
      },
      workflow: {
        title: '⚙️ Workflow',
        description: 'Sequential process orchestration',
        details: 'Executes predefined steps in order, typically human-triggered, coordinates multiple tools or systems.',
        color: '#6366f1',
      },
      tool: {
        title: '🔧 Internal Tool',
        description: 'Utility or helper function',
        details: 'Provides utility to operations, supports internal processes, on-demand or background utility.',
        color: '#8b5cf6',
      },
      product: {
        title: '📦 Product',
        description: 'Customer-facing offering',
        details: 'Delivers external value to customers, standalone offering or major feature, customer-visible.',
        color: '#ec4899',
      },
    };
    return info[type];
  };

  const handleProceed = () => {
    if (result) {
      router.push(`/register/choose?type=${result}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Classify Your Work</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Answer 5 quick questions to determine the type</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
              Question 1 of 5
            </h2>
            <p style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', fontWeight: '500' }}>
              Does it make autonomous decisions or only provide information?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleAnswer('q1', true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: answers.q1 === true ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: answers.q1 === true ? '#eff6ff' : 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: answers.q1 === true ? '#1e40af' : '#64748b',
                }}
              >
                Makes decisions
              </button>
              <button
                onClick={() => handleAnswer('q1', false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: answers.q1 === false ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: answers.q1 === false ? '#eff6ff' : 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: answers.q1 === false ? '#1e40af' : '#64748b',
                }}
              >
                Info only
              </button>
            </div>
          </div>

          {answers.q1 !== null && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
                Question 2 of 5
              </h2>
              <p style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', fontWeight: '500' }}>
                Is it customer-facing or internal only?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAnswer('q2', true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q2 === true ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q2 === true ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q2 === true ? '#1e40af' : '#64748b',
                  }}
                >
                  Customer-facing
                </button>
                <button
                  onClick={() => handleAnswer('q2', false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q2 === false ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q2 === false ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q2 === false ? '#1e40af' : '#64748b',
                  }}
                >
                  Internal only
                </button>
              </div>
            </div>
          )}

          {answers.q2 !== null && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
                Question 3 of 5
              </h2>
              <p style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', fontWeight: '500' }}>
                Does it orchestrate multi-step processes in sequence?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAnswer('q3', true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q3 === true ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q3 === true ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q3 === true ? '#1e40af' : '#64748b',
                  }}
                >
                  Yes, multi-step
                </button>
                <button
                  onClick={() => handleAnswer('q3', false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q3 === false ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q3 === false ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q3 === false ? '#1e40af' : '#64748b',
                  }}
                >
                  No, single step
                </button>
              </div>
            </div>
          )}

          {answers.q3 !== null && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
                Question 4 of 5
              </h2>
              <p style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', fontWeight: '500' }}>
                Does it take external actions (send emails, modify records, execute trades)?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAnswer('q4', true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q4 === true ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q4 === true ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q4 === true ? '#1e40af' : '#64748b',
                  }}
                >
                  Yes, takes actions
                </button>
                <button
                  onClick={() => handleAnswer('q4', false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q4 === false ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q4 === false ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q4 === false ? '#1e40af' : '#64748b',
                  }}
                >
                  No, read-only
                </button>
              </div>
            </div>
          )}

          {answers.q4 !== null && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
                Question 5 of 5
              </h2>
              <p style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', fontWeight: '500' }}>
                Is it primarily a utility or helper function?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAnswer('q5', true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q5 === true ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q5 === true ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q5 === true ? '#1e40af' : '#64748b',
                  }}
                >
                  Yes, utility
                </button>
                <button
                  onClick={() => handleAnswer('q5', false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: answers.q5 === false ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: answers.q5 === false ? '#eff6ff' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: answers.q5 === false ? '#1e40af' : '#64748b',
                  }}
                >
                  No, primary service
                </button>
              </div>
            </div>
          )}
        </div>

        {showExplanation && result && (
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <div
              style={{
                borderLeft: `4px solid ${getTypeInfo(result).color}`,
                paddingLeft: '20px',
                marginBottom: '24px',
              }}
            >
              <h2 style={{ margin: '0 0 6px', fontSize: '22px', color: '#1e293b', fontWeight: '600' }}>
                {getTypeInfo(result).title}
              </h2>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#64748b' }}>
                {getTypeInfo(result).description}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                {getTypeInfo(result).details}
              </p>
            </div>

            <button
              onClick={handleProceed}
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
              }}
            >
              Continue to Tier Selection →
            </button>
          </div>
        )}

        {!showExplanation && (
          <div style={{ textAlign: 'center' }}>
            <a href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
              ← Back to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
