'use client';

export default function ExportPage() {
  const handleExport = (format: 'csv' | 'json') => {
    const data = [
      { name: 'Claude 3 Opus', owner: 'Alice Chen', tier: 'Full-review', status: 'Assigned' },
      { name: 'GPT-4 Turbo', owner: 'Bob Martinez', tier: 'Light-touch', status: 'Approved' },
    ];

    let content: string;
    let filename: string;

    if (format === 'csv') {
      const headers = ['Name', 'Owner', 'Tier', 'Status'];
      const rows = data.map((row) => [row.name, row.owner, row.tier, row.status]);
      content = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      filename = 'agents-export.csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'agents-export.json';
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px' }}>Export Agent Register</h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Download compliance audit data</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, color: '#1e3a8a', marginBottom: '8px' }}>Export Format</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Select your preferred file format</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
            <button
              onClick={() => handleExport('csv')}
              style={{
                padding: '20px',
                border: '2px solid #3b82f6',
                backgroundColor: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#3b82f6',
                fontSize: '14px'
              }}
            >
              📊 Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              style={{
                padding: '20px',
                border: '2px solid #3b82f6',
                backgroundColor: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#3b82f6',
                fontSize: '14px'
              }}
            >
              {'{}'} Export as JSON
            </button>
          </div>

          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ margin: '0', color: '#0369a1', fontSize: '14px' }}>
              ℹ️ Your data is exported from the current register. Timestamp: {new Date().toLocaleString()}
            </p>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
