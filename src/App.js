import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

// நம்முடைய புதிய மெமரி கான்டெக்ஸ்ட் இம்போர்ட் செய்கிறோம்
import { AlgoContext } from './AlgoContext';

// 🔌 கான்பிக் ஃபைலில் இருக்கும் ஆன்லைன் ரெண்டர் லிங்க்கை எடுக்கிறோம் அண்ணா
import { API_BASE_URL } from './config';

// சரியான ஃபைல் பெயர்கள்
import Login from './Login';
import Dashboard from './Dashboard'; 
import Register from './components/Register'; 
// --- உங்கள் ஸ்கிரீன்ஷாட் படி மாற்றப்பட்ட வரி ---
import BrokerSetup from './BrokerSettings'; 
import AlgoBuilder from './AlgoBuilder'; 
import StrategyHub from './components/StrategyHub'; 
import PMS from './components/PMSPanel';

// 🚀 லோக்கல்ஹோஸ்ட்டுக்குப் பதிலாக ஆன்லைன் Render URL-ஐப் பயன்படுத்தும் படி மாற்றப்பட்டுள்ளது அண்ணா!
const socket = io(API_BASE_URL, {
  transports: ['websocket'],
  upgrade: false
});

function App() {
  // கான்டெக்ஸ்டில் இருந்து ஒட்டுமொத்த ஆப்பிற்குமான activeTab மெமரியை எடுக்கிறோம்
  const { activeTab, setActiveTab } = useContext(AlgoContext);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [authView, setAuthView] = useState('login'); 

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleSetAuth = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('algo_running_ids'); // லாக் அவுட் செய்யும்போது மெமரியை க்ளியர் செய்கிறோம்
    localStorage.removeItem('algo_active_tab');
    setAuthView('login');
    setActiveTab('dashboard'); // மீண்டும் டீஃபால்ட்டாக டேஷ்போர்டிற்கு மாற்றுகிறோம்
  };

  if (!isLoggedIn) {
    if (authView === 'register') return <Register onGoToLogin={() => setAuthView('login')} />;
    return <Login setAuth={handleSetAuth} onGoToRegister={() => setAuthView('register')} />;
  }

  return (
    <div style={{ background: '#0a0e14', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <nav style={styles.nav}>
        <div style={{ color: '#00f2ea', fontSize: '18px', fontWeight: 'bold' }}>ALGO MAGIC PRO 🚀</div>
        <div style={styles.navLinks}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? styles.activeBtn : styles.btn}>🏠 DASHBOARD</button>
          <button onClick={() => setActiveTab('hub')} style={activeTab === 'hub' ? styles.activeBtn : styles.btn}>🎯 STRATEGY HUB</button>
          <button onClick={() => setActiveTab('builder')} style={activeTab === 'builder' ? styles.activeBtn : styles.btn}>🛠️ BUILDER</button>
          <button onClick={() => setActiveTab('broker')} style={activeTab === 'broker' ? styles.activeBtn : styles.btn}>🔌 BROKER</button>
          <button onClick={() => setActiveTab('pms')} style={activeTab === 'pms' ? styles.activeBtn : styles.btn}>📊 PMS</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        {activeTab === 'dashboard' && <Dashboard socket={socket} />}
        {activeTab === 'hub' && <StrategyHub />}
        {activeTab === 'builder' && <AlgoBuilder />}
        
        {/* BROKER TAB - இங்கே BrokerSetup என்பது BrokerSettings-ஐ குறிக்கும் */}
        {activeTab === 'broker' && (
          <BrokerSetup onClose={() => setActiveTab('dashboard')} />
        )}
        
        {/* PMS TAB */}
        {activeTab === 'pms' && <PMS />}
      </div>
    </div>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '0 30px', background: '#0d1117', borderBottom: '1px solid #333', alignItems: 'center', height: '70px' },
  navLinks: { display: 'flex', gap: '15px' },
  btn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '10px', fontSize: '13px', fontWeight: 'bold' },
  activeBtn: { background: 'none', border: 'none', color: '#00f2ea', cursor: 'pointer', padding: '10px', borderBottom: '2px solid #00f2ea', fontSize: '13px', fontWeight: 'bold' },
  logoutBtn: { background: '#f85149', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginLeft: '20px' }
};

export default App;