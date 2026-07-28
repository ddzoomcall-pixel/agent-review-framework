export default function DashboardPage() {
  const agents = [
    { id: '1', name: 'Claude 3 Opus', owner: 'Alice Chen', team: 'AI Platform', tier: 'Full-review', status: 'Assigned' },
    { id: '2', name: 'GPT-4 Turbo', owner: 'Bob Martinez', team: 'Content', tier: 'Light-touch', status: 'Approved' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>AI Agent Governance Platform</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Compliance Dashboard</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', border: '2px solid #3b82f6', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a' }}>{agents.length}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL REGISTERED</div>
          </div>
          <div style={{ backgroundColor: 'white', border: '2px solid #3b82f6', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a' }}>1</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>FULL-REVIEW TIER</div>
          </div>
          <div style={{ backgroundColor: 'white', border: '2px solid #3b82f6', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a' }}>0</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>MISMATCHES</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid #dbeafe' }}>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#1e3a8a' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#1e3a8a' }}>Owner</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#1e3a8a' }}>Tier</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#1e3a8a' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '16px', color: '#1f2937', fontWeight: '500' }}>{agent.name}</td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>{agent.owner}, {agent.team}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: agent.tier === 'Full-review' ? '#dbeafe' : '#e0f2fe',
                      color: agent.tier === 'Full-review' ? '#1e40af' : '#0369a1',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {agent.tier}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: agent.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                      color: agent.status === 'Approved' ? '#166534' : '#92400e',
                      fontSize: '12px'
                    }}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
          <a href="/register" style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
          }}>
            Register Agent
          </a>
          <a href="/export" style={{
            padding: '12px 24px',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            border: '1px solid #bae6fd'
          }}>
            Export Data
          </a>
        </div>
      </div>
    </div>
  );
}
