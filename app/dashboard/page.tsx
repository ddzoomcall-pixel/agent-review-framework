export default function DashboardPage() {
  const agents = [
    { id: '1', name: 'Claude 3 Opus', owner: 'Alice Chen', team: 'AI Platform', tier: 'Full-review', status: 'Assigned' },
    { id: '2', name: 'GPT-4 Turbo', owner: 'Bob Martinez', team: 'Content', tier: 'Light-touch', status: 'Approved' },
  ];

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Agent Governance Platform</h1>
      <h2>Compliance Dashboard</h2>

      <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{agents.length}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>TOTAL REGISTERED</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>1</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>FULL-REVIEW TIER</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>0</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>MISMATCHES</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold' }}>Owner</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold' }}>Tier</th>
            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{agent.name}</td>
              <td style={{ padding: '12px' }}>{agent.owner}, {agent.team}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: agent.tier === 'Full-review' ? '#ffd700' : '#87ceeb',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {agent.tier}
                </span>
              </td>
              <td style={{ padding: '12px' }}>{agent.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '30px' }}>
        <a href="/register" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px', marginRight: '10px' }}>
          Register Agent
        </a>
        <a href="/export" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Export Data
        </a>
      </div>
    </div>
  );
}
