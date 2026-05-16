import React, { useState } from 'react';
import IndexOptions from './IndexOptions';
import StrategyBuilder from './StrategyBuilder';

const AlgoBuilder = () => {
  const [subTab, setSubTab] = useState('index');
  const [lang, setLang] = useState('TM'); // TM - தமிழ், EN - English
  const [tradeMode, setTradeMode] = useState('DEMO'); // DEMO or LIVE

  // மொழி பெயர்ப்புக்கான ஒரு சிறிய பங்க்ஷன்
  const t = (tm, en) => lang === 'TM' ? tm : en;

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 1. டாப் கண்ட்ரோல்ஸ் (Language & Trade Mode) */}
      <div style={topControls}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setTradeMode('DEMO')} 
            style={tradeMode === 'DEMO' ? activeDemo : inactiveBtn}>
            🎮 {t("டெமோ டிரேடிங்", "DEMO TRADE")}
          </button>
          <button 
            onClick={() => setTradeMode('LIVE')} 
            style={tradeMode === 'LIVE' ? activeLive : inactiveBtn}>
            💰 {t("லைவ் டிரேடிங்", "LIVE TRADE")}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#8b949e' }}>{t("மொழி:", "Lang:")}</span>
          <button onClick={() => setLang(lang === 'TM' ? 'EN' : 'TM')} style={langBtn}>
             {lang === 'TM' ? "ENGLISH" : "தமிழ்"}
          </button>
        </div>
      </div>

      <hr style={{ borderColor: '#333', marginBottom: '20px' }} />

      {/* 2. சப்-டேப்கள் (Index & Strategy) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button 
          onClick={() => setSubTab('index')} 
          style={subTab === 'index' ? activeSubBtn : subBtn}>
          📊 {t("இண்டெக்ஸ் ஆப்ஷன்ஸ்", "INDEX OPTIONS")}
        </button>
        <button 
          onClick={() => setSubTab('strategy')} 
          style={subTab === 'strategy' ? activeSubBtn : subBtn}>
          📡 {t("ஸ்ட்ராட்டஜி பில்டர்", "STRATEGY BUILDER")}
        </button>
      </div>

      {/* 3. முக்கிய உள்ளடக்கம் */}
      <div style={{ minHeight: '400px', background: '#0d1117', padding: '15px', borderRadius: '10px', border: '1px solid #333' }}>
        {subTab === 'index' ? 
          <IndexOptions selectedIndex="NIFTY" lang={lang} /> : 
          <StrategyBuilder lang={lang} />
        }
      </div>

      {/* 4. அக்கவுண்ட் விவரங்கள் & டெப்ளோய் பட்டன் (Footer) */}
      <div style={footerStyle}>
        <div style={accInfo}>
          <span style={{ color: '#8b949e' }}>{t("ரியல் அக்கவுண்ட்:", "Real Account:")}</span>
          <span style={{ color: tradeMode === 'LIVE' ? '#50fa7b' : '#ffb86c' }}>
            {tradeMode === 'LIVE' ? " RK_VEL_PRO (Live Connected)" : " DEMO_VIRTUAL_01"}
          </span>
        </div>
        
        <button style={deployBtn} onClick={() => alert(t("ஸ்ட்ராட்டஜி வெற்றிகரமாக டிப்ளாய் செய்யப்பட்டது!", "Strategy Deployed Successfully!"))}>
          🚀 {t("டிப்ளாய் ஸ்ட்ராட்டஜி", "DEPLOY STRATEGY")}
        </button>
      </div>

    </div>
  );
};

// --- Styles ---
const topControls = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' };
const langBtn = { background: '#30363d', color: '#00f2ea', border: '1px solid #444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' };
const subBtn = { background: '#21262d', color: '#888', border: '1px solid #30363d', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' };
const activeSubBtn = { background: '#30363d', color: '#00f2ea', border: '1px solid #00f2ea', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };

const inactiveBtn = { background: '#21262d', color: '#888', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const activeDemo = { background: '#ffb86c', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const activeLive = { background: '#50fa7b', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };

const footerStyle = { marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22', padding: '20px', borderRadius: '10px', border: '1px solid #30363d' };
const accInfo = { fontSize: '13px', fontWeight: '500' };
const deployBtn = { background: '#238636', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 15px rgba(35, 134, 54, 0.3)' };

export default AlgoBuilder;