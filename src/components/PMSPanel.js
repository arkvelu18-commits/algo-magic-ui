import React, { useState, useEffect } from 'react';

const PMSStandalonePage = () => {
  // PMS-க்கு தேவையான தனி டேட்டா செட்
  const [pmsData, setPmsData] = useState({
    totalAUM: 2575000,
    activeClients: 15,
    todayPnL: 18400,
    signalStatus: 'WAITING', // WAITING, EXECUTING, COMPLETED
  });

  const [clients, setClients] = useState([
    { id: 'DM001', name: 'Raja K', broker: 'AngelOne', margin: '5.5L', m2m: 4200, status: 'Connected' },
    { id: 'DM002', name: 'Muthu V', broker: 'AliceBlue', margin: '12.0L', m2m: 8500, status: 'Connected' },
    { id: 'DM003', name: 'Senthil', broker: 'Zerodha', margin: '2.0L', m2m: -1200, status: 'Error' },
    { id: 'DM004', name: 'Arun Pro', broker: 'Fyers', margin: '6.2L', m2m: 6900, status: 'Connected' },
  ]);

  return (
    <div style={pmsStyles.pageWrapper}>
      {/* --- PMS HEADER SECTION --- */}
      <div style={pmsStyles.pmsHeader}>
        <div>
          <h1 style={pmsStyles.pageTitle}>💼 PMS Dashboard <span style={pmsStyles.tag}>Admin Track</span></h1>
          <p style={pmsStyles.subText}>Portfolio Management & Multi-Client Execution Control</p>
        </div>
        <div style={pmsStyles.masterSwitch}>
          <label style={{marginRight: '10px', fontSize: '12px'}}>MASTER KILL SWITCH</label>
          <button style={pmsStyles.killBtn}>Emergency Stop</button>
        </div>
      </div>

      {/* --- TOP 4 LOGIC GADGETS (4 கார்டுகள்) --- */}
      <div style={pmsStyles.statsGrid}>
        <div style={pmsStyles.statCard}>
          <label>TOTAL AUM (Funds Under Algo)</label>
          <h2>₹ {(pmsData.totalAUM / 100000).toFixed(2)} Lakhs</h2>
        </div>
        <div style={pmsStyles.statCard}>
          <label>ACTIVE CLIENTS</label>
          <h2 style={{color: '#00f2ea'}}>{pmsData.activeClients} / 20</h2>
        </div>
        <div style={pmsStyles.statCard}>
          <label>NET M2M (TODAY)</label>
          <h2 style={{color: pmsData.todayPnL >= 0 ? '#50fa7b' : '#ff5555'}}>
            {pmsData.todayPnL >= 0 ? '+' : ''}₹ {pmsData.todayPnL.toLocaleString()}
          </h2>
        </div>
        <div style={pmsStyles.statCard}>
          <label>SIGNAL ENGINE STATUS</label>
          <h2 style={{color: '#ffd700'}}>● {pmsData.signalStatus}</h2>
        </div>
      </div>

      {/* --- CLIENT TRACKING TABLE --- */}
      <div style={pmsStyles.tableSection}>
        <div style={pmsStyles.tableHeaderTitle}>Live Client Track List</div>
        <table style={pmsStyles.table}>
          <thead>
            <tr style={pmsStyles.trHead}>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Broker API</th>
              <th>Margin Used</th>
              <th>Today's P&L</th>
              <th>Live Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} style={pmsStyles.trBody}>
                <td>{client.id}</td>
                <td style={{fontWeight: 'bold'}}>{client.name}</td>
                <td>{client.broker}</td>
                <td>{client.margin}</td>
                <td style={{color: client.m2m >= 0 ? '#50fa7b' : '#ff5555', fontWeight: 'bold'}}>
                  {client.m2m >= 0 ? '+' : ''}{client.m2m}
                </td>
                <td>
                  <span style={{
                    ...pmsStyles.statusDot, 
                    background: client.status === 'Connected' ? '#50fa7b' : '#ff5555'
                  }}></span> {client.status}
                </td>
                <td>
                  <button style={pmsStyles.editBtn}>Settings</button>
                  <button style={pmsStyles.pauseBtn}>Pause</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- SYSTEM AUDIT TRAIL (நேரலை லாக்) --- */}
      <div style={pmsStyles.auditSection}>
        <h4 style={{marginBottom: '10px', color: '#8b949e'}}>System Audit Trail (Execution Log)</h4>
        <div style={pmsStyles.auditBox}>
          <p>👉 [09:15:01] Algo Engine Started...</p>
          <p>👉 [09:30:45] Signal Generated: NIFTY 25000 CE Buy</p>
          <p style={{color: '#50fa7b'}}>✅ [09:30:46] Orders pushed to all 15 Connected Clients successfully.</p>
          <p>👉 [11:20:10] Trailing Stoploss Updated for Master Strategy.</p>
        </div>
      </div>
    </div>
  );
};

// --- PMS EXCLUSIVE STYLES ---
const pmsStyles = {
  pageWrapper: { background: '#0a0e14', minHeight: '100vh', padding: '30px', color: '#fff', fontFamily: 'Segoe UI, sans-serif' },
  pmsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  pageTitle: { fontSize: '24px', margin: 0, color: '#ffd700' },
  tag: { fontSize: '10px', background: '#333', padding: '3px 8px', borderRadius: '4px', marginLeft: '10px', verticalAlign: 'middle' },
  subText: { color: '#8b949e', fontSize: '13px', marginTop: '5px' },
  masterSwitch: { textAlign: 'right' },
  killBtn: { background: '#4a1010', color: '#ff5555', border: '1px solid #ff5555', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { background: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
  
  tableSection: { background: '#161b22', borderRadius: '12px', border: '1px solid #30363d', overflow: 'hidden' },
  tableHeaderTitle: { padding: '15px 20px', background: '#21262d', color: '#8b949e', fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #30363d' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  trHead: { background: '#161b22', color: '#8b949e', fontSize: '12px', textTransform: 'uppercase' },
  trBody: { borderBottom: '1px solid #21262d', fontSize: '14px' },
  statusDot: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '5px' },
  
  editBtn: { background: '#30363d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', fontSize: '11px', cursor: 'pointer' },
  pauseBtn: { background: '#4a1010', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },

  auditSection: { marginTop: '30px' },
  auditBox: { background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8', color: '#888' }
};

export default PMSStandalonePage;