import React, { useState, useEffect } from 'react';

const InlineAlgoControl = () => {
  const [brokerData, setBrokerData] = useState({
    userId: 'E1S69',
    password: '',
    apiSecret: '',
    totp: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: 'Ready to Start', type: 'idle' });
  const [isLive, setIsLive] = useState(false); // அல்கோ ஓடுகிறதா இல்லையா என்பதை அறிய

  // அல்கோவைத் தொடங்கும் பங்க்ஷன்
  const handleStartAlgo = async () => {
    setLoading(true);
    setStatus({ msg: 'Connecting to Zebu...', type: 'process' });

    try {
      const response = await fetch('http://localhost:5000/api/start_algo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brokerData)
      });
      const result = await response.json();

      if (result.status === "success") {
        setStatus({ msg: '🚀 ALGO LIVE', type: 'success' });
        setIsLive(true);
      } else {
        setStatus({ msg: '❌ Failed: ' + result.message, type: 'error' });
      }
    } catch (err) {
      setStatus({ msg: '❌ Server Offline', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.inlineCard}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>ALGO ENGINE CONTROL</h3>
        <div style={{...styles.statusDot, backgroundColor: isLive ? '#00ff88' : '#ff5350'}}></div>
      </div>

      <div style={styles.inputGroup}>
        <input 
          type="password" 
          placeholder="Password" 
          style={styles.smallInput} 
          onChange={(e) => setBrokerData({...brokerData, password: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="TOTP Key" 
          style={styles.smallInput}
          onChange={(e) => setBrokerData({...brokerData, totp: e.target.value})}
        />
      </div>

      <div style={styles.msgBox}>
        <span style={{color: status.type === 'success' ? '#00ff88' : '#8b949e'}}>
          {status.msg}
        </span>
      </div>

      <button 
        onClick={handleStartAlgo} 
        disabled={loading || isLive}
        style={{...styles.mainBtn, opacity: (loading || isLive) ? 0.6 : 1}}
      >
        {loading ? 'STARTING...' : isLive ? 'ALGO RUNNING' : 'ACTIVATE ALGO'}
      </button>
    </div>
  );
};

const styles = {
  inlineCard: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '12px',
    padding: '20px',
    width: '300px', // டேஷ்போர்டின் ஒரு ஓரத்தில் கச்சிதமாக அமையும்
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  title: { color: '#00f2ea', fontSize: '14px', margin: 0 },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', boxShadow: '0 0 10px currentColor' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  smallInput: { background: '#0d1117', border: '1px solid #30363d', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px', outline: 'none' },
  msgBox: { margin: '15px 0', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' },
  mainBtn: { width: '100%', padding: '10px', background: '#00f2ea', border: 'none', borderRadius: '6px', color: '#0d1117', fontWeight: 'bold', cursor: 'pointer' }
};

export default InlineAlgoControl;