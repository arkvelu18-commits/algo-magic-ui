import React, { useState } from 'react';

const AlgoBuilder = () => {
  const [language, setLanguage] = useState('tamil'); 
  const [isDemo, setIsDemo] = useState(true);
  const [activeTab, setActiveTab] = useState('builder'); 
  
  // Rules and Execution States
  const [rules, setRules] = useState([{ id: 1, indicator: 'RSI', p1: '14', cond: 'crosses above', p2: '60' }]);
  const [exec, setExec] = useState({ index: 'NIFTY 50', type: 'BUY CE', mode: 'ATM', strikePrice: '', price: 'Market' });

  // Mock Data for Top Strategies
  const topStrategies = [
    { id: 1, name: "Intraday RSI Scalper", winRate: "72%", pnl: "+15,000", author: "Rajesh" },
    { id: 2, name: "CPR Breakout Master", winRate: "68%", pnl: "+22,400", author: "Kumar" },
    { id: 3, name: "EMA Cross 5Min", winRate: "81%", pnl: "+11,200", author: "Selvam" }
  ];

  const dict = {
    tamil: {
      title: "PRO ALGO MASTER", pms: "PMS பேனல்", addRule: "+ ரூல் சேர்", activate: "ஆக்டிவேட்",
      step1: "படி 1: சிக்னல் ரூல்ஸ்", step2: "படி 2: எக்ஸிகியூஷன்",
      topStr: "🚀 டாப் ஸ்ட்ராட்டஜிகள்", upload: "டேட்டா அப்லோட்", join: "ஜாயின்",
      indicator: "இண்டிகேட்டர்", cond: "நிபந்தனை", val: "மதிப்பு",
      index: "இன்டெக்ஸ்", type: "வகை", mode: "முறை", sPrice: "ஸ்ட்ரைக் விலை"
    },
    eng: {
      title: "PRO ALGO MASTER", pms: "PMS Panel", addRule: "+ Add Rule", activate: "ACTIVATE",
      step1: "STEP 1: SIGNAL RULES", step2: "STEP 2: EXECUTION",
      topStr: "🚀 Top Strategies", upload: "Upload Data", join: "Join",
      indicator: "Indicator", cond: "Condition", val: "Value",
      index: "Index", type: "Type", mode: "Mode", sPrice: "Strike Price"
    }
  };

  const t = dict[language] || dict['eng'];

  const generateCode = () => {
    let code = `# Auto-Generated Code\nimport algo_magic as am\n\n`;
    rules.forEach((r, i) => { code += `rule_${i+1} = am.check('${r.indicator}', cond='${r.cond}')\n`; });
    code += `\nif rule_1:\n  am.place_order(symbol='${exec.index}', strike='${exec.strikePrice || exec.mode}', type='${exec.type}')`;
    return code;
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.contentBody}>
        
        {/* --- HEADER --- */}
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            {/* அண்ணா, இங்கே இருந்த Duplicate Style சரி செய்யப்பட்டது */}
            <h2 
              onClick={() => setActiveTab('builder')} 
              style={{...styles.mainTitle, cursor: 'pointer'}}
            >
              🛠️ {t.title}
            </h2>
            
            <button style={styles.pmsBtn} onClick={() => alert("PMS Dashboard Opening...")}>
              💼 {t.pms}
            </button>
            
            <button 
              style={activeTab === 'top_strategies' ? styles.tabBtnActive : styles.tabBtn} 
              onClick={() => setActiveTab('top_strategies')}
            >
              {t.topStr}
            </button>
          </div>
          
          <div style={styles.topActions}>
            <div style={styles.langSwitch}>
              <span onClick={() => setLanguage('tamil')} style={language === 'tamil' ? styles.activeLang : styles.inactiveLang}>தமிழ்</span>
              <span onClick={() => setLanguage('eng')} style={language === 'eng' ? styles.activeLang : styles.inactiveLang}>ENG</span>
            </div>
            <button onClick={() => setIsDemo(!isDemo)} style={styles.modeBtn}>
              {isDemo ? "🟢 Demo" : "🔴 Real"}
            </button>
          </div>
        </div>

        {activeTab === 'builder' ? (
          <div style={styles.mainLayout}>
            <div style={{ flex: 1.5 }}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>📜 {t.step1}</span>
                  <button onClick={() => setRules([...rules, { id: Date.now(), indicator: 'EMA', p1: '20', cond: 'crosses above', p2: 'LTP' }])} style={styles.addBtn}>{t.addRule}</button>
                </div>
                {rules.map((rule) => (
                  <div key={rule.id} style={styles.row}>
                    <div style={styles.col}><label style={styles.label}>{t.indicator}</label>
                      <select style={styles.input} defaultValue={rule.indicator}><option>RSI</option><option>CPR</option><option>EMA</option></select>
                    </div>
                    <div style={styles.col}><label style={styles.label}>P1</label><input type="text" style={styles.input} defaultValue={rule.p1} /></div>
                    <div style={styles.col}><label style={styles.label}>{t.cond}</label>
                      <select style={styles.input} defaultValue={rule.cond}><option>crosses above</option><option>crosses below</option></select>
                    </div>
                    <div style={styles.col}><label style={styles.label}>P2</label><input type="text" style={styles.input} defaultValue={rule.p2} /></div>
                    <button style={styles.delBtn} onClick={() => setRules(rules.filter(r => r.id !== rule.id))}>×</button>
                  </div>
                ))}
              </div>

              <div style={styles.card}>
                <span style={styles.cardLabel}>⚡ {t.step2}</span>
                <div style={styles.row}>
                  <div style={styles.col}><label style={styles.label}>{t.index}</label>
                    <select style={styles.input} onChange={(e) => setExec({...exec, index: e.target.value})} value={exec.index}><option>NIFTY 50</option><option>BANK NIFTY</option></select>
                  </div>
                  <div style={styles.col}><label style={styles.label}>{t.mode}</label>
                    <select style={styles.input} onChange={(e) => setExec({...exec, mode: e.target.value})} value={exec.mode}><option>ATM</option><option>ITM</option></select>
                  </div>
                  <div style={styles.col}><label style={styles.label}>{t.sPrice}</label>
                    <input type="number" style={styles.input} placeholder="24500" value={exec.strikePrice} onChange={(e) => setExec({...exec, strikePrice: e.target.value})} />
                  </div>
                  <button style={styles.activeBtn} onClick={() => alert("Algo Activated!")}>{t.activate} 🚀</button>
                </div>
              </div>
            </div>

            <div style={styles.codeWindow}>
               <div style={styles.codeHeader}>💻 Code Preview</div>
               <pre style={styles.codeText}>{generateCode()}</pre>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 style={{color: '#ffd700'}}>{t.topStr}</h3>
              <button style={styles.uploadBtn} onClick={() => alert("Select CSV/Excel File to Upload Strategy Data")}>
                📤 {t.upload}
              </button>
            </div>
            
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Strategy Name</th>
                  <th style={styles.th}>Win Rate</th>
                  <th style={styles.th}>Total PnL</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topStrategies.map(s => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={{...styles.td, color: '#238636', fontWeight: 'bold'}}>{s.winRate}</td>
                    <td style={{...styles.td, color: '#00f2ea'}}>{s.pnl}</td>
                    <td style={styles.td}>{s.author}</td>
                    <td style={styles.td}>
                      <button style={styles.joinBtn} onClick={() => alert(`Joined ${s.name}!`)}>
                        {t.join}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles அப்படியே இருக்கின்றன... (சுருக்கத்திற்காக இங்கே தவிர்க்கப்பட்டுள்ளது, உங்கள் பழைய ஸ்டைல்ஸே இதற்கும் பொருந்தும்)
const styles = {
  appContainer: { background: '#0a0e14', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  contentBody: { padding: '25px', maxWidth: '1550px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #30363d', paddingBottom: '20px' },
  mainTitle: { color: '#00f2ea', fontSize: '24px', margin: 0, fontWeight: 'bold' },
  topActions: { display: 'flex', gap: '20px', alignItems: 'center' },
  pmsBtn: { background: 'rgba(255, 215, 0, 0.1)', color: '#ffd700', border: '1px solid #ffd700', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  tabBtn: { background: 'transparent', color: '#8b949e', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  tabBtnActive: { background: 'rgba(0, 242, 234, 0.1)', color: '#00f2ea', borderBottom: '2px solid #00f2ea', padding: '5px 10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  langSwitch: { background: '#1c2128', padding: '5px', borderRadius: '8px', display: 'flex', gap: '15px' },
  activeLang: { color: '#00f2ea', fontWeight: 'bold', cursor: 'pointer' },
  inactiveLang: { color: '#8b949e', cursor: 'pointer' },
  modeBtn: { background: '#238636', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' },
  mainLayout: { display: 'flex', gap: '25px' },
  card: { background: '#0d1117', padding: '25px', borderRadius: '15px', border: '1px solid #30363d', marginBottom: '25px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  cardLabel: { color: '#8b949e', fontSize: '14px', fontWeight: 'bold' },
  row: { display: 'flex', gap: '15px', background: '#161b22', padding: '18px', borderRadius: '12px', alignItems: 'flex-end', marginBottom: '12px' },
  col: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', color: '#8b949e' },
  input: { background: '#0a0e14', color: '#fff', border: '1px solid #30363d', padding: '12px', borderRadius: '8px', width: '100%' },
  addBtn: { background: 'transparent', color: '#00f2ea', border: '1px solid #00f2ea', padding: '6px 15px', borderRadius: '6px' },
  delBtn: { background: 'none', border: 'none', color: '#f85149', fontSize: '24px', cursor: 'pointer' },
  activeBtn: { background: '#00f2ea', color: '#000', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold' },
  uploadBtn: { background: '#ffd700', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  joinBtn: { background: 'transparent', color: '#00f2ea', border: '1px solid #00f2ea', padding: '5px 15px', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { textAlign: 'left', padding: '15px', color: '#8b949e', borderBottom: '1px solid #30363d' },
  td: { padding: '15px', borderBottom: '1px solid #161b22' },
  codeWindow: { flex: 0.8, background: '#011627', borderRadius: '15px', border: '1px solid #30363d', height: 'fit-content' },
  codeHeader: { background: '#1e2d3d', padding: '15px', color: '#00f2ea' },
  codeText: { padding: '20px', color: '#d6deeb', fontSize: '13px', margin: 0, fontFamily: 'monospace' }
};

export default AlgoBuilder;