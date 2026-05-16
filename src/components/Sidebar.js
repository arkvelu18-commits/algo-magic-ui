import React from 'react';

const Sidebar = ({ setActiveTab, activeTab, setIsLoggedIn }) => {

  const menuItems = [
    { name: 'DASHBOARD', tabName: 'dashboard', icon: '📊' },
    { name: 'BROKER SETUP', tabName: 'broker', icon: '🔌' },
    { name: 'ALGO BUILDER', tabName: 'builder', icon: '🧠' },
    { name: 'PMS PANEL', tabName: 'pms', icon: '💼' },
    { name: 'TOP STRATEGIES', tabName: 'top', icon: '🚀' },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>MAGIC ALGO</div>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div 
            key={item.tabName} 
            onClick={() => setActiveTab(item.tabName)} 
            style={{
              ...itemContainer,
              background: activeTab === item.tabName ? '#d4af3722' : 'transparent',
              borderLeft: activeTab === item.tabName ? '4px solid #d4af37' : '4px solid transparent',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: '15px', fontSize: '18px' }}>{item.icon}</span>
            <span style={{ 
              color: activeTab === item.tabName ? '#d4af37' : '#888',
              fontWeight: activeTab === item.tabName ? 'bold' : 'normal'
            }}>
              {item.name}
            </span>
          </div>
        ))}
      </nav>

      {/* கீழே ஒரு Logout பட்டன் */}
      <div 
        onClick={() => setIsLoggedIn(false)} 
        style={{ ...itemContainer, color: '#f85149', cursor: 'pointer', borderTop: '1px solid #222' }}
      >
        <span style={{ marginRight: '15px' }}>🚪</span>
        <span>LOGOUT</span>
      </div>
    </div>
  );
};

/* --- Sidebar Styles --- */
const sidebarStyle = {
  width: '240px',
  background: '#0a0a0a',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed', // சைட்பார் நகராமல் இருக்க
  left: 0,
  top: 0
};

const logoStyle = {
  padding: '30px 20px',
  color: '#d4af37',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center',
  letterSpacing: '2px',
  borderBottom: '1px solid #222',
  marginBottom: '20px'
};

const itemContainer = {
  padding: '15px 25px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  transition: '0.3s',
  marginBottom: '5px'
};

export default Sidebar;