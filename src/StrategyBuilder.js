import React, { useState } from 'react';

const StrategyBuilder = () => {
  // IndexOptions-ல் இருந்த அதே அட்வான்ஸ்டு லாஜிக் செட்டப்
  const initialRule = { 
    id: Date.now(), 
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

  const [activeStrategy, setActiveStrategy] = useState('PRICE_ACTION');
  const [strategyData, setStrategyData] = useState({
    'PRICE_ACTION': [{ ...initialRule, id: 1 }],
    'SCALPING': [{ ...initialRule, id: 2 }]
  });

  const addRow = () => {
    const newRow = { ...initialRule, id: Date.now() + Math.random() };
    setStrategyData(prev => ({
      ...prev,
      [activeStrategy]: [...(prev[activeStrategy] || []), newRow]
    }));
  };

  const deleteRow = (id) => {
    setStrategyData(prev => ({
      ...prev,
      [activeStrategy]: prev[activeStrategy].filter(r => r.id !== id)
    }));
  };

  const updateRule = (id, field, value) => {
    setStrategyData(prev => ({
      ...prev,
      [activeStrategy]: prev[activeStrategy].map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  return (
    <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
      {/* Main Builder Column */}
      <div style={mainColumn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={colTitle}>📡 {activeStrategy} Strategy Setup</h3>
          <button onClick={addRow} style={addBtn}>+ Add Logic</button>
        </div>
        
        <div style={tableHeader}>
          <div style={tableGridAdjusted}>
            <span>ENTRY TYPE</span><span>LOGIC / SETTINGS</span><span>SIGNAL</span><span>ENTRY</span><span>COND</span><span>SIDE</span><span>SL</span><span>TGT</span><span></span>
          </div>
        </div>

        {(strategyData[activeStrategy] || []).map((rule) => (
          <div key={rule.id} style={ruleRowStyle}>
            <div style={tableGridAdjusted}>
              
              {/* ENTRY TYPE */}
              <select style={{...inputStyle, color: '#00f2ea'}} value={rule.entryType} onChange={(e) => updateRule(rule.id, 'entryType', e.target.value)}>
                <option value="Pattern">Pattern Mode</option>
                <option value="Time">Time Mode</option>
                <option value="EMA">EMA Cross</option>
              </select>

              {/* LOGIC SETTINGS (Dynamic based on Entry Type) */}
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

              {/* SIGNAL CANDLE */}
              <select style={inputStyle} value={rule.entryCandle} onChange={(e) => updateRule(rule.id, 'entryCandle', e.target.value)}>
                <option value="Last_Candle">Last Candle</option>
                <option value="Next_Green">Next Green</option>
                <option value="Next_Red">Next Red</option>
              </select>

              {/* ENTRY POINT */}
              <select style={inputStyle}>
                <option>High</option><option>Low</option><option>Close</option>
              </select>
              
              {/* CONDITION */}
              <select style={{...inputStyle, color: '#ffd43b'}} value={rule.action} onChange={(e) => updateRule(rule.id, 'action', e.target.value)}>
                <option value="Crosses Above">Crosses Above</option>
                <option value="Crosses Below">Crosses Below</option>
              </select>

              {/* SIDE (BUY/SELL) */}
              <select style={{...inputStyle, color: rule.side === 'BUY' ? '#50fa7b' : '#ff5555'}} value={rule.side} onChange={(e) => updateRule(rule.id, 'side', e.target.value)}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              
              {/* SL & TARGET */}
              <select style={inputStyle} value={rule.sl} onChange={(e) => updateRule(rule.id, 'sl', e.target.value)}>
                <option value="Low">Low</option><option value="High">High</option><option value="Close">Close</option>
              </select>
              <input style={inputStyle} value={rule.target} onChange={(e) => updateRule(rule.id, 'target', e.target.value)} />
              
              <button onClick={() => deleteRow(rule.id)} style={delBtn}>×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Live Logic View */}
      <div style={sideColumn}>
        <h3 style={colTitle}>💻 LIVE LOGIC DETAILS</h3>
        <div style={codeBox}>
          {(strategyData[activeStrategy] || []).map((r, i) => (
               <div key={i} style={{...codeLine, borderLeft: `3px solid ${r.side === 'BUY' ? '#50fa7b' : '#ff5555'}`}}>
                 <b style={{color: r.side === 'BUY' ? '#50fa7b' : '#ff5555'}}>{activeStrategy} {r.side}</b> <br/>
                 <span style={{fontSize:'12px', color:'#8b949e'}}>
                    {r.entryType} முறையில் {r.action} ஆனால் ஆர்டர் செய்யப்படும். <br/>
                    <b>SL:</b> {r.sl} | <b>TGT:</b> {r.target}
                 </span>
               </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const mainColumn = { flex: 7.5, background: '#161b22', padding: '15px', borderRadius: '10px', border: '1px solid #30363d' };
const sideColumn = { flex: 2.5, background: '#0d1117', padding: '15px', borderRadius: '10px', border: '1px solid #333' };
const colTitle = { fontSize: '14px', color: '#00f2ea', margin: 0, fontWeight: 'bold' };
const tableHeader = { padding: '10px', color: '#8b949e', fontSize: '11px', fontWeight: 'bold' };

// Strike நீக்கப்பட்டதால் Grid Columns அட்ஜஸ்ட் செய்யப்பட்டுள்ளது
const tableGridAdjusted = { 
  display: 'grid', 
  gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 1.1fr 0.6fr 0.8fr 0.6fr 30px', 
  gap: '10px',
  alignItems: 'center'
};

const ruleRowStyle = { background: '#21262d', padding: '10px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #30363d' };
const inputStyle = { background: '#0d1117', color: '#fff', border: '1px solid #333', padding: '8px', borderRadius: '4px', fontSize: '13px', width: '100%', outline: 'none' };
const addBtn = { background: '#238636', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' };
const delBtn = { background: 'none', color: '#ff5555', border: 'none', fontSize: '20px', cursor: 'pointer' };
const codeBox = { background: '#1a1d23', padding: '12px', borderRadius: '8px', fontSize: '12px' };
const codeLine = { marginBottom: '15px', paddingLeft: '10px' };

export default StrategyBuilder;