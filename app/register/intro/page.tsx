'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agentName: '',
    owner: '',
    department: '',
    llmUsed: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agentName.trim()) newErrors.agentName = 'Agent name is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner name is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.llmUsed) newErrors.llmUsed = 'LLM selection is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Pass data to form as query params
    const params = new URLSearchParams({
      q1: formData.agentName,
      q2: formData.owner,
      department: formData.department,
      q12: formData.llmUsed,
    });

    router.push(`/register/form?${params.toString()}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Register an AI Agent</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Step 1: Basic Information</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '40px' }}>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1e3a8a' }}>Let's start with the basics</div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0 0' }}>
              Tell us about your AI agent before we dive into the comprehensive questionnaire
            </p>
          </div>

          {/* Agent Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '14px' }}>
              What is the name of your agent? *
            </label>
            <p style={{ fontSize: '12px', color: '#8a8880', margin: '0 0 8px' }}>
              This is how it will be identified in the registry and governance reviews
            </p>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              placeholder="e.g., Portfolio Risk Analyzer, Email Summary Bot"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.agentName ? '2px solid #dc2626' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.agentName && <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.agentName}</div>}
          </div>

          {/* Owner */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '14px' }}>
              Who is the business owner? *
            </label>
            <p style={{ fontSize: '12px', color: '#8a8880', margin: '0 0 8px' }}>
              Point person responsible for this agent's governance and decisions
            </p>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="Full name"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.owner ? '2px solid #dc2626' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.owner && <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.owner}</div>}
          </div>

          {/* Department */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '14px' }}>
              What department or team? *
            </label>
            <p style={{ fontSize: '12px', color: '#8a8880', margin: '0 0 8px' }}>
              Where this agent lives organizationally
            </p>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Risk Management, Operations, Research"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.department ? '2px solid #dc2626' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {errors.department && <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.department}</div>}
          </div>

          {/* LLM Used */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1e3a8a', fontSize: '14px' }}>
              What LLM is it built on? *
            </label>
            <p style={{ fontSize: '12px', color: '#8a8880', margin: '0 0 8px' }}>
              The primary AI model powering this agent
            </p>
            <select
              name="llmUsed"
              value={formData.llmUsed}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.llmUsed ? '2px solid #dc2626' : '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                background: 'white',
              }}
            >
              <option value="">Select an LLM...</option>
              <option value="Approved LLMs">Claude (Approved)</option>
              <option value="Approved LLMs">GPT-4 (Approved)</option>
              <option value="Approved LLMs">Gemini (Approved)</option>
              <option value="Unapproved LLMs">Unapproved LLM</option>
              <option value="Agent platforms">Agent Platform</option>
              <option value="Copilots">Copilot</option>
              <option value="Multiple">Multiple LLMs</option>
            </select>
            {errors.llmUsed && <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors.llmUsed}</div>}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
                color: '#1e3a8a',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Back
            </button>
            <button
              onClick={handleContinue}
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
              Continue to Questionnaire →
            </button>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
            <p style={{ margin: '0', fontSize: '12px', color: '#0369a1', lineHeight: '1.6' }}>
              💡 After you complete these basics, you'll answer a 30-question comprehensive intake questionnaire that auto-computes your risk tier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
