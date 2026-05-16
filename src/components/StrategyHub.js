import React, { useState } from 'react';

const StrategyHub = ({ onEdit }) => {
  const [marketStrategies, setMarketStrategies] = useState([
    {
      id: 1,
      name: "Price Action Pro",
      creator: "RK_Vel",
      accuracy: "85%",
      rating: 4.5,
      subscribers: 120,
      description: "Inside Bar மற்றும் Hammer பேட்டர்ன்களை அடிப்படையாகக் கொண்டது."
    }
  ]);

  const [activeChat, setActiveChat] = useState(null); // எந்த ஸ்ட்ராட்டஜிக்கு சாட் நடக்கிறது
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div style={{ padding: '10px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <h2 style={{ color: '#00f2ea', margin: 0 }}>🎯 Strategy Marketplace</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {marketStrategies.map((strat) => (
          <div key={strat.id} style={cardStyle}>
            <div style={ratingBadge}>⭐ {strat.rating}</div>
            <h3 style={{ color: '#fff', marginBottom: '5px' }}>{strat.name}</h3>
            <p style={{ color: '#8b949e', fontSize: '12px' }}>{strat.description}</p>
            
            <div style={statsLine}>
              <span>👥 {strat.subscribers} Traders</span>
              <span style={{color: '#50fa7b'}}>Accuracy: {strat.accuracy}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
              <button style={useBtn}>USE</button>
              <button style={detailsBtn} onClick={onEdit}>LOGIC</button>
              {/* சாட் பட்டன் */}
              <button style={chatBtn} onClick={() => setActiveChat(strat.name)}>💬 CHAT</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Floating Chat Window --- */}
      {activeChat && (
        <div style={chatWindow}>
          <div style={chatHeader}>
            <span>Chat with {activeChat} Creator</span>
            <button onClick={() => setActiveChat(null)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}>✖</button>
          </div>
          <div style={chatBody}>
            <p style={{fontSize: '11px', color: '#8b949e', textAlign: 'center'}}>நேரடியாக ஆலோசனைகளை இங்கே பகிருங்கள்...</p>
          </div>
          <div style={chatInputArea}>
            <input 
              style={chatInput} 
              placeholder="Type suggestion..." 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button style={sendBtn} onClick={() => {alert("Sent!"); setChatMessage("");}}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const cardStyle = { background: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d', position: 'relative' };
const ratingBadge = { position: 'absolute', top: '15px', right: '15px', color: '#ffd43b', fontSize: '12px', fontWeight: 'bold' };
const statsLine = { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' };

const useBtn = { flex: 1, background: '#00f2ea', color: '#000', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const detailsBtn = { flex: 1, background: '#30363d', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' };
const chatBtn = { flex: 1, background: '#21262d', color: '#ffd43b', border: '1px solid #ffd43b', padding: '8px', borderRadius: '4px', cursor: 'pointer' };

// Chat Window Styles
const chatWindow = { position: 'fixed', bottom: '20px', right: '20px', width: '300px', height: '350px', background: '#161b22', border: '1px solid #00f2ea', borderRadius: '10px', display: 'flex', flexDirection: 'column', boxShadow: '0 0 20px rgba(0,0,0,0.5)', zIndex: 1000 };
const chatHeader = { background: '#0d1117', padding: '10px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' };
const chatBody = { flex: 1, padding: '10px', overflowY: 'auto' };
const chatInputArea = { padding: '10px', display: 'flex', gap: '5px', borderTop: '1px solid #333' };
const chatInput = { flex: 1, background: '#0d1117', border: '1px solid #333', color: '#fff', padding: '5px', borderRadius: '4px', outline: 'none', fontSize: '12px' };
const sendBtn = { background: '#00f2ea', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' };

export default StrategyHub;