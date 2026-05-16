import React, { useState } from 'react';

const IndexOptions = ({ selectedIndex, lang }) => {
  // அனைத்து இண்டெக்ஸ்களுக்கும் (SENSEX உட்பட) Default Data செட் செய்யப்பட்டுள்ளது
  const initialRule = { 
    id: Date.now(), 
    strikePrice: 'ATM', 
    entryType: 'Pattern', 
    redCount: '4', 
    startTime: '09:15', 
    emaShort: '9', 
    emaLong: '21', 
    entryCandle: 'Last_Candle', 
    action: 'Crosses Above', 
    side: 'BUY', 
    sl: 'Low', 
    target: '1:2' 
  };

  const [indexData, setIndexData] = useState({
    'NIFTY': [{ ...initialRule, id: 1, strikePrice: '24200' }],
    'BANKNIFTY': [{ ...initialRule, id: 2, strikePrice: '52500' }],
    'SENSEX': [{ ...initialRule, id: 3, strikePrice: '80000' }],
    'FINNIFTY': [{ ...initialRule, id: 4, strikePrice: '23500' }]
  });

  const addCondition = () => {
    const newRule = { ...initialRule, id: Date.now() + Math.random(), strikePrice: '0' };
    setIndexData(prev => ({
      ...prev,
      [selectedIndex]: [...(prev[selectedIndex] || []), newRule]
    }));
  };

  const deleteRule = (id) => {
    setIndexData(prev => ({
      ...prev,
      [selectedIndex]: prev[selectedIndex].filter(r => r.id !== id)
    }));
  };

  const updateRule = (id, field, value) => {
    setIndexData(prev => ({
      ...prev,
      [selectedIndex]: prev[selectedIndex].map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const t = (en, tm) => lang === 'EN' ? en : tm;

  return (
    <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
      {/* Main Builder Column */}
      <div style={mainColumn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={colTitle}>📡 {selectedIndex} Strategy Builder</h3>
          <button onClick={addCondition} style={addBtn}>+ {t("ADD CONDITION", "புது கண்டிஷன்")}</button>
        </div>
        
        <div style={tableHeader}>
          <div style={tableGridAdjusted}>
            <span>STRIKE</span><span>ENTRY TYPE</span><span>LOGIC / SETTINGS</span><span>SIGNAL</span><span>ENTRY</span><span>COND</span><span>SIDE</span><span>SL</span><span>TGT</span><span></span>
          </div>
        </div>

        {(indexData[selectedIndex] || []).map((rule) => (
          <div key={rule.id} style={ruleRowStyle}>
            <div style={tableGridAdjusted}>
              {/* STRIKE - அளவு குறைக்கப்பட்டுள்ளது */}
              <input style={inputStyle} value={rule.strikePrice} onChange={(e) => updateRule(rule.id, 'strikePrice', e.target.value)} />
              
              <select style={{...inputStyle, color: '#00f2ea'}} value={rule.entryType} onChange={(e) => updateRule(rule.id, 'entryType', e.target.value)}>
                <option value="Pattern">Pattern Mode</option>
                <option value="Time">Time Mode</option>
                <option value="EMA">EMA Cross</option>
              </select>

              <div style={{ display: 'flex', gap: '4px' }}>
                {rule.entryType === 'Pattern' && (
                  <select style={inputStyle} value={rule.redCount} onChange={(e) => updateRule(rule.id, 'redCount', e.target.value)}>
                    <option value="3">3 Candles</option><option value="4">4 Candles</option><option value="5">5 Candles</option>
                  </select>
                )}
                {rule.entryType === 'Time' && (
                  <input style={inputStyle} type="time" value={rule.startTime} onChange={(e) => updateRule(rule.id, 'startTime', e.target.value)} />
                )}
                {rule.entryType === 'EMA' && (
                  <>
                    <input style={{...inputStyle, textAlign:'center'}} placeholder="S" value={rule.emaShort} onChange={(e) => updateRule(rule.id, 'emaShort', e.target.value)} />
                    <input style={{...inputStyle, textAlign:'center'}} placeholder="L" value={rule.emaLong} onChange={(e) => updateRule(rule.id, 'emaLong', e.target.value)} />
                  </>
                )}
              </div>

              <select style={inputStyle} value={rule.entryCandle} onChange={(e) => updateRule(rule.id, 'entryCandle', e.target.value)}>
                <option value="Last_Candle">Last Candle</option>
                <option value="Next_Green">Next Green</option>
                <option value="Next_Red">Next Red</option>
              </select>

              <select style={inputStyle}><option>High</option><option>Low</option><option>Close</option></select>
              
              <select style={{...inputStyle, color: '#ffd43b'}} value={rule.action} onChange={(e) => updateRule(rule.id, 'action', e.target.value)}>
                <option value="Crosses Above">Crosses Above</option>
                <option value="Crosses Below">Crosses Below</option>
              </select>

              <select style={{...inputStyle, color: rule.side === 'BUY' ? '#50fa7b' : '#ff5555'}} value={rule.side} onChange={(e) => updateRule(rule.id, 'side', e.target.value)}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              
              <select style={inputStyle} value={rule.sl} onChange={(e) => updateRule(rule.id, 'sl', e.target.value)}>
                <option value="Low">Low</option><option value="High">High</option><option value="Close">Close</option>
              </select>
              <input style={inputStyle} value={rule.target} onChange={(e) => updateRule(rule.id, 'target', e.target.value)} />
              
              <button onClick={() => deleteRule(rule.id)} style={delBtn}>×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Logic Column */}
      <div style={sideColumn}>
        <h3 style={colTitle}>💻 {t("LIVE LOGIC", "லைவ் லாஜிக் ವಿವರம்")}</h3>
        <div style={codeBox}>
          {(indexData[selectedIndex] || []).map((r, i) => (
               <div key={i} style={{...codeLine, borderLeft: `3px solid ${r.side === 'BUY' ? '#50fa7b' : '#ff5555'}`}}>
                 <b style={{color: r.side === 'BUY' ? '#50fa7b' : '#ff5555'}}>{selectedIndex} {r.side}</b> <br/>
                 <span style={{fontSize:'12px', color:'#8b949e'}}>
                    {r.action} ஆனால் ஆர்டர் செய்யப்படும். <br/>
                    <b>SL:</b> {r.sl} | <b>TGT:</b> {r.target}
                 </span>
               </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles - Font Size 13px ஆக உயர்த்தப்பட்டுள்ளது
const mainColumn = { flex: 7.8, background: '#161b22', padding: '15px', borderRadius: '10px', border: '1px solid #30363d' };
const sideColumn = { flex: 2.2, background: '#0d1117', padding: '15px', borderRadius: '10px', border: '1px solid #333' };
const colTitle = { fontSize: '14px', color: '#00f2ea', margin: 0, fontWeight: 'bold' };
const tableHeader = { padding: '10px', color: '#8b949e', fontSize: '11px', fontWeight: 'bold' };

// கிரிட் அட்ஜஸ்ட்மென்ட்: முதல் காலம் (STRIKE) குறைக்கப்பட்டு, நடு காலங்களுக்கு இடம் ஒதுக்கப்பட்டுள்ளது
const tableGridAdjusted = { 
  display: 'grid', 
  gridTemplateColumns: '0.7fr 1.1fr 1fr 1fr 0.8fr 1.1fr 0.6fr 0.6fr 0.6fr 30px', 
  gap: '8px' 
};

const ruleRowStyle = { background: '#21262d', padding: '10px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #30363d' };

// Input Font Size 13px
const inputStyle = { 
  background: '#0d1117', 
  color: '#fff', 
  border: '1px solid #333', 
  padding: '8px', 
  borderRadius: '4px', 
  fontSize: '13px', 
  width: '100%', 
  outline: 'none' 
};

const addBtn = { background: '#238636', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' };
const delBtn = { background: 'none', color: '#ff5555', border: 'none', fontSize: '18px', cursor: 'pointer' };
const codeBox = { background: '#1a1d23', padding: '12px', borderRadius: '8px', fontSize: '12px' };
const codeLine = { marginBottom: '15px', paddingLeft: '10px' };

export default IndexOptions;