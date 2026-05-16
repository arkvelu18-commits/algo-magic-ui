import React, { useState } from 'react';

const BrokerSettings = ({ onClose }) => {
  const [brokerData, setBrokerData] = useState({
    userId: 'E1S69', 
    password: '',
    apiKey: '6nteqRk3Z38C3mPGMwHMSB7tAs499SB2',
    totp: ''
  });

  const [riskSettings, setRiskSettings] = useState({
    trailingPercentage: '0.5',
    maxLotMultiplier: '4',
    profitTarget: '30000',
    stopLoss: '5000'
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, STARTING, ACTIVE, ERROR
  const [visibility, setVisibility] = useState({ pass: false });
  const [isTrailingEnabled, setIsTrailingEnabled] = useState(true);
  const [isLotMultiplierEnabled, setIsLotMultiplierEnabled] = useState(true);

  const handleBrokerChange = (e, field) => {
    setBrokerData({ ...brokerData, [field]: e.target.value });
  };

  const handleRiskChange = (e, field) => {
    setRiskSettings({ ...riskSettings, [field]: e.target.value });
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // செக்யூரிட்டி கீ தேவையில்லை என்பதால் மற்றவற்றை மட்டும் சரிபார்க்கிறது
    if (!brokerData.userId || !brokerData.password) {
      alert("தயவுசெய்து User ID மற்றும் Password பூர்த்தி செய்யவும்!");
      return;
    }

    setLoading(true);
    setStatus('STARTING');

    try {
      const response = await fetch('http://localhost:5000/api/start_algo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brokerData,
          ...riskSettings,
          isTrailingEnabled,
          isLotMultiplierEnabled
        })
      });

      const result = await response.json();

      if (result.status === "success" || result.stat === "Ok") {
        setStatus('ACTIVE');
        // ஆல்கோ ஸ்டார்ட் ஆனதை உறுதிப்படுத்த ஒரு சின்ன மெசேஜ்
        alert("✅ Algo Started Successfully! Redirecting to Dashboard...");
        
        // 1.5 செகண்டில் தானாக டேஷ்போர்டுக்கு அழைத்துச் செல்லும்
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setStatus('ERROR');
        alert("❌ லாகின் தோல்வி: " + (result.message || "தகவல்களைச் சரிபார்க்கவும்"));
      }
    } catch (error) {
      setStatus('ERROR');
      alert("❌ சர்வர் இணைப்பு இல்லை! தயவுசெய்து Backend-ஐ ஸ்டார்ட் செய்யவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>PRO TRADER CONTROL PANEL</h2>
            <span style={styles.headerSub}>Advanced Zero Risk Automated System</span>
          </div>
          <button type="button" onClick={onClose} style={styles.closeX}>×</button>
        </div>

        <div style={styles.body}>
          <div style={styles.sectionLeft}>
            <h4 style={styles.sectionTitle}>🔌 BROKER AUTHENTICATION</h4>
            
            <div style={styles.inputBox}>
              <label style={styles.label}>USER ID</label>
              <input 
                type="text" 
                value={brokerData.userId} 
                onChange={(e) => handleBrokerChange(e, 'userId')}
                style={styles.activeInput} 
              />
            </div>

            <div style={styles.inputBox}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.inputWrapper}>
                <input 
                  type={visibility.pass ? "text" : "password"} 
                  value={brokerData.password} 
                  onChange={(e) => handleBrokerChange(e, 'password')}
                  style={styles.activeInput} 
                />
                <button type="button" onClick={() => setVisibility({...visibility, pass: !visibility.pass})} style={styles.eyeBtn}>
                  {visibility.pass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div style={styles.inputBox}>
              <label style={styles.label}>TOTP / 2FA KEY</label>
              <input 
                type="text" 
                placeholder="Check App & Enter" 
                style={styles.activeInput} 
                value={brokerData.totp}
                onChange={(e) => handleBrokerChange(e, 'totp')}
              />
            </div>

            <div style={styles.inputBox}>
              <label style={styles.label}>API ACCESS KEY</label>
              <input 
                type="text" 
                value={brokerData.apiKey} 
                onChange={(e) => handleBrokerChange(e, 'apiKey')}
                style={styles.activeInput} 
              />
            </div>
          </div>

          <div style={styles.sectionRight}>
            <h4 style={styles.sectionTitle}>🛡️ SMART RISK MGMT</h4>
            
            <div style={styles.riskGrid}>
              <div style={styles.statCard}>
                <span style={styles.statTitle}>PROFIT TARGET (₹)</span>
                <input 
                  type="number" 
                  value={riskSettings.profitTarget} 
                  onChange={(e) => handleRiskChange(e, 'profitTarget')}
                  style={styles.editableInput}
                />
              </div>
              <div style={styles.statCard}>
                <span style={styles.statTitleSL}>MAX LOSS (₹)</span>
                <input 
                  type="number" 
                  value={riskSettings.stopLoss} 
                  onChange={(e) => handleRiskChange(e, 'stopLoss')}
                  style={styles.editableInput}
                />
              </div>
            </div>

            <div style={styles.configRow}>
              <label style={styles.label}>TRAILING SL (%)</label>
              <input 
                type="number" 
                style={styles.smallInput} 
                value={riskSettings.trailingPercentage} 
                onChange={(e) => handleRiskChange(e, 'trailingPercentage')}
              />
            </div>

            <div style={styles.controlGroup}>
              <button 
                type="button"
                style={{...styles.toggleBtn, borderColor: isTrailingEnabled ? '#00f2ea' : '#30363d'}}
                onClick={() => setIsTrailingEnabled(!isTrailingEnabled)}
              >
                {isTrailingEnabled ? '✅ TRAILING ACTIVE' : '❌ TRAILING OFF'}
              </button>
              <button 
                type="button"
                style={{...styles.toggleBtn, borderColor: isLotMultiplierEnabled ? '#00f2ea' : '#30363d'}}
                onClick={() => setIsLotMultiplierEnabled(!isLotMultiplierEnabled)}
              >
                {isLotMultiplierEnabled ? '🚀 MULTIPLIER ON' : '📉 FIXED LOT'}
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" style={styles.cancelBtn} onClick={onClose}>CANCEL</button>
          <button 
            type="button" 
            style={{
                ...styles.saveBtn, 
                backgroundColor: status === 'ACTIVE' ? '#26a69a' : '#00f2ea'
            }} 
            onClick={handleSave} 
            disabled={loading || status === 'ACTIVE'}
          >
            {status === 'STARTING' ? "CONNECTING..." : 
             status === 'ACTIVE' ? "ALGO ACTIVE ✅" : "SAVE & START ALGO"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(5px)' },
  modalContainer: { background: '#0d1117', width: '750px', borderRadius: '12px', border: '1px solid #30363d', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  header: { background: '#161b22', padding: '15px 25px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#00f2ea', margin: 0, fontSize: '16px', fontWeight: 'bold' },
  headerSub: { color: '#8b949e', fontSize: '10px' },
  closeX: { background: 'none', border: 'none', color: '#8b949e', fontSize: '20px', cursor: 'pointer' },
  body: { display: 'flex' },
  sectionLeft: { flex: 1.1, padding: '20px', borderRight: '1px solid #30363d' },
  sectionRight: { flex: 1, padding: '20px', background: '#090d13' },
  sectionTitle: { color: '#fff', fontSize: '11px', marginBottom: '15px', fontWeight: 'bold', borderLeft: '3px solid #00f2ea', paddingLeft: '8px' },
  inputBox: { marginBottom: '12px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  eyeBtn: { position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#00f2ea', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' },
  label: { display: 'block', color: '#8b949e', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' },
  activeInput: { width: '100%', padding: '10px', background: '#010409', border: '1px solid #30363d', color: '#fff', borderRadius: '6px', fontSize: '12px', outline: 'none' },
  riskGrid: { display: 'flex', gap: '10px', marginBottom: '15px' },
  statCard: { flex: 1, background: '#161b22', padding: '10px', borderRadius: '8px', border: '1px solid #30363d', textAlign: 'center' },
  statTitle: { display: 'block', color: '#26a69a', fontSize: '9px', fontWeight: 'bold' },
  statTitleSL: { display: 'block', color: '#ef5350', fontSize: '9px', fontWeight: 'bold' },
  editableInput: { background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', width: '100%', textAlign: 'center', outline: 'none', borderBottom: '1px dashed #30363d' },
  configRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  smallInput: { width: '80px', padding: '5px', background: '#010409', border: '1px solid #00f2ea', color: '#00f2ea', borderRadius: '4px', textAlign: 'center', outline: 'none' },
  controlGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  toggleBtn: { padding: '10px', background: '#010409', border: '1px solid #30363d', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#fff' },
  footer: { padding: '15px 25px', background: '#161b22', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { padding: '8px 20px', background: 'transparent', border: '1px solid #30363d', color: '#8b949e', fontSize: '11px', borderRadius: '6px', cursor: 'pointer' },
  saveBtn: { padding: '8px 25px', border: 'none', color: '#0d1117', fontSize: '11px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }
};

export default BrokerSettings;