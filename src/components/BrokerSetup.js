import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BrokerSetup = () => {
  const navigate = useNavigate();
  const [isLiveActive, setIsLiveActive] = useState(false);

  const [brokerData, setBrokerData] = useState({
    selectedBroker: 'zebu', userId: '', password: '', apiKey: '', apiSecret: ''
  });

  const [riskSettings, setRiskSettings] = useState({
    dailyMaxProfit: 30000, dailyMaxLoss: 5000, 
    isTrailingEnabled: true, trailingPoints: 10,
    isIncrementEnabled: false, startLot: 1, maxLot: 10,
    orderType: 'MIS', productType: 'MARKET'
  });

  useEffect(() => {
    const isConnected = localStorage.getItem('isBrokerConnected');
    if (isConnected === 'true') { setIsLiveActive(true); }
  }, []);

  const handleInputChange = (e, field) => { setBrokerData({ ...brokerData, [field]: e.target.value }); };
  const handleRiskChange = (e, field) => { setRiskSettings({ ...riskSettings, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }); };

  const handleActivateAlgo = async () => {
    if (!brokerData.userId || !brokerData.apiKey) { alert("விவரங்களை உள்ளிடவும்!"); return; }
    
    try {
      // 127.0.0.1:5000 லோக்கல் சர்வருடன் கனெக்ட் செய்கிறோம்
      const response = await axios.post('http://127.0.0.1:5000/api/broker-login', { 
        brokerDetails: brokerData, 
        riskSettings: riskSettings 
      });
      
      if (response.status === 200) {
        setIsLiveActive(true);
        localStorage.setItem('isBrokerConnected', 'true');
        // வெற்றிகரமாக லாகின் ஆனவுடன் டேஷ்போர்டிற்கு நேவிகேட் செய்கிறோம்
        setTimeout(() => { navigate('/dashboard'); }, 1000);
      }
    } catch (error) { 
      console.error("Login Error:", error);
      alert("Connection Failed! api_server.py ஓடுகிறதா என்று பார்க்கவும்."); 
    }
  };

  return (
    <div style={container}>
      <div style={leftSection}>
        <div style={header}>
          <h2 style={title}>⚙️ SYSTEM CONFIGURATION</h2>
          <div style={{...statusBadge, background: isLiveActive ? '#238636' : '#30363d'}}>
            {isLiveActive ? 'ALGO LIVE' : 'READY'}
          </div>
        </div>

        <div style={contentArea}>
          {/* BROKER DETAILS */}
          <div style={sectionBox}>
            <div style={inputRow}>
              <div style={inputGroup}><label style={label}>BROKER</label>
                <select style={inputStyle} value={brokerData.selectedBroker} onChange={(e) => handleInputChange(e, 'selectedBroker')}>
                  <option value="zebu">ZEBU FINANCIAL</option>
                  <option value="angel">ANGEL ONE</option>
                </select>
              </div>
              <div style={inputGroup}><label style={label}>USER ID</label>
                <input type="text" style={inputStyle} placeholder="Enter ID" value={brokerData.userId} onChange={(e) => handleInputChange(e, 'userId')} />
              </div>
            </div>
            <div style={inputRow}>
              <div style={inputGroup}><label style={label}>PASSWORD</label><input type="password" style={inputStyle} placeholder="••••••" value={brokerData.password} onChange={(e) => handleInputChange(e, 'password')} /></div>
              <div style={inputGroup}><label style={label}>API SECRET</label><input type="password" style={inputStyle} placeholder="Secret" value={brokerData.apiSecret} onChange={(e) => handleInputChange(e, 'apiSecret')} /></div>
            </div>
            <div style={inputGroup}><label style={label}>API ACCESS KEY</label><input type="text" style={inputStyle} placeholder="Enter Key" value={brokerData.apiKey} onChange={(e) => handleInputChange(e, 'apiKey')} /></div>
          </div>

          <div style={flexRowGap}>
            {/* RISK MANAGEMENT */}
            <div style={{...sectionBox, flex: 1}}>
              <h4 style={sectionLabel}>RISK MGT</h4>
              <div style={inputRow}>
                <div style={statBox}>
                    <label style={label}>PROFIT ₹</label>
                    <input type="number" style={profitIn} value={riskSettings.dailyMaxProfit} onChange={(e) => handleRiskChange(e, 'dailyMaxProfit')} />
                </div>
                <div style={statBox}>
                    <label style={label}>LOSS ₹</label>
                    <input type="number" style={lossIn} value={riskSettings.dailyMaxLoss} onChange={(e) => handleRiskChange(e, 'dailyMaxLoss')} />
                </div>
              </div>
            </div>

            {/* TRAILING SL */}
            <div style={{...sectionBox, flex: 1}}>
              <div style={flexSpace}>
                <h4 style={sectionLabel}>TRAILING SL</h4>
                <input type="checkbox" style={checkbox} checked={riskSettings.isTrailingEnabled} onChange={() => setRiskSettings({...riskSettings, isTrailingEnabled: !riskSettings.isTrailingEnabled})} />
              </div>
              <div style={{...inputGroup, marginTop: '5px'}}>
                <input type="number" placeholder="Points" disabled={!riskSettings.isTrailingEnabled} style={inputStyle} value={riskSettings.trailingPoints} onChange={(e)=>handleRiskChange(e, 'trailingPoints')} />
              </div>
            </div>
          </div>

          <div style={sectionBox}>
            <div style={inputRow}>
               <div style={inputGroup}><label style={label}>ORDER</label>
                 <select style={inputStyle} value={riskSettings.orderType} onChange={(e)=>handleRiskChange(e, 'orderType')}>
                   <option value="MIS">INTRADAY</option>
                   <option value="NRML">OVERNIGHT</option>
                 </select>
               </div>
               <div style={inputGroup}><label style={label}>PRODUCT</label>
                 <select style={inputStyle} value={riskSettings.productType} onChange={(e)=>handleRiskChange(e, 'productType')}>
                   <option value="MARKET">MARKET</option>
                   <option value="LIMIT">LIMIT</option>
                 </select>
               </div>
            </div>
          </div>
        </div>

        <div style={footer}>
          <button style={btnReset} onClick={() => { localStorage.clear(); window.location.reload(); }}>RESET</button>
          <button style={{...btnSubmit, opacity: isLiveActive ? 0.7 : 1}} onClick={handleActivateAlgo} disabled={isLiveActive}>
            {isLiveActive ? 'LIVE ACTIVE' : 'ACTIVATE ALGO'}
          </button>
        </div>
      </div>

      <div style={rightSection}>
        <h3 style={rightTitle}>📘 பயன்முறை</h3>
        <div style={ruleContent}>
           <p style={ruleItem}><b>01.</b> API விவரங்களைச் சரியாகப் பதிவிடவும்.</p>
           <p style={ruleItem}><b>02.</b> வரம்பை முதலீட்டிற்கு ஏற்ப செட் செய்யவும்.</p>
        </div>
      </div>
    </div>
  );
};

/* --- Styles --- */
const container = { display: 'flex', height: '100vh', background: '#0a0e14', color: '#fff', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '20px', overflow: 'hidden' };
const leftSection = { width: '60%', height: '84vh', display: 'flex', flexDirection: 'column', background: '#161b22', borderRadius: '8px', border: '1px solid #30363d', marginRight: '15px' };
const rightSection = { width: '22%', height: '84vh', padding: '15px', background: '#0a0e14' };
const header = { padding: '10px 15px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const title = { margin: 0, fontSize: '14px', color: '#00f2ea', fontWeight: 'bold' };
const statusBadge = { padding: '4px 8px', borderRadius: '15px', fontSize: '10px', fontWeight: 'bold', color: '#fff' };
const contentArea = { padding: '10px 15px', flex: 1, overflowY: 'auto' };
const footer = { padding: '10px 15px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#0d1117' };
const sectionBox = { marginBottom: '8px', padding: '10px', background: '#0d1117', borderRadius: '6px', border: '1px solid #30363d' };
const sectionLabel = { color: '#00f2ea', fontSize: '10px', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' };
const inputRow = { display: 'flex', gap: '10px', marginBottom: '8px' };
const flexRowGap = { display: 'flex', gap: '10px' };
const inputGroup = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' };
const label = { fontSize: '9px', color: '#8b949e', fontWeight: 'bold' };
const inputStyle = { background: '#161b22', border: '1px solid #30363d', padding: '8px', borderRadius: '4px', color: '#fff', outline: 'none', fontSize: '12px' };
const checkbox = { width: '16px', height: '16px', cursor: 'pointer', accentColor: '#00f2ea' };

// வார்னிங்கைத் தவிர்க்க Border மாற்றப்பட்டது
const statBox = { 
  flex: 1, 
  textAlign: 'center', 
  padding: '5px', 
  background: '#161b22', 
  borderRadius: '6px',
  // border சொத்தை முழுமையாக நீக்கிவிட்டுத் தேவையானதை மட்டும் வைக்கிறோம்
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none'
};

const profitIn = { 
  background: 'none', 
  borderTop: 'none', 
  borderLeft: 'none', 
  borderRight: 'none', 
  borderBottom: '2px solid #238636', 
  color: '#50fa7b', 
  textAlign: 'center', 
  width: '100%', 
  fontSize: '14px', 
  fontWeight: 'bold', 
  outline: 'none' 
};
const lossIn = { ...profitIn, borderBottom: '2px solid #f85149', color: '#f85149' };

const rightTitle = { fontSize: '14px', color: '#00f2ea', borderBottom: '1px solid #30363d', paddingBottom: '8px', marginBottom: '15px', fontWeight: 'bold' };
const ruleContent = { marginBottom: '15px' };
const ruleItem = { fontSize: '12px', color: '#e6edf3', marginBottom: '10px', lineHeight: '1.4' };
const btnSubmit = { background: '#00f2ea', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' };
const btnReset = { background: 'none', border: '1px solid #30363d', color: '#8b949e', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const flexSpace = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

export default BrokerSetup;