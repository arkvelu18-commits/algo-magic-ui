import React, { useState } from 'react';

// 'onGoToLogin' என்பது App.js-லிருந்து வரும் சரியான பெயர்
const Register = ({ onGoToLogin }) => { 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("❌ கடவுச்சொல் பொருந்தவில்லை!");
      return;
    }
    
    alert("✅ பதிவு வெற்றிகரமாக முடிந்தது! நிர்வாகியின் அனுமதிக்கு காத்திருக்கவும்.");
    console.log("User Data:", formData);
    onGoToLogin(); // லாகின் பக்கத்திற்குத் திரும்ப அழைத்துச் செல்லும்
  };

  return (
    <div style={mainPageWrapper}>
      <div style={loginBox}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={loginHeader}>Create Account</h2>
          <p style={{ color: '#9da5b1', fontSize: '14px', marginTop: '8px' }}>
            Start your trading journey with Algo Magic Pro
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={inputGrp}>
            <label style={labelStyle}>FULL NAME</label>
            <input type="text" name="fullName" style={inputStyle} onChange={handleChange} placeholder="Enter your full name" required />
          </div>
          <div style={inputGrp}>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <input type="email" name="email" style={inputStyle} onChange={handleChange} placeholder="example@mail.com" required />
          </div>
          <div style={inputGrp}>
            <label style={labelStyle}>PHONE NUMBER</label>
            <input type="text" name="phone" style={inputStyle} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
          </div>
          <div style={inputGrp}>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" name="password" style={inputStyle} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div style={inputGrp}>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <input type="password" name="confirmPassword" style={inputStyle} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" style={loginBtn}>REGISTER NOW 🚀</button>
        </form>

        <div style={backToLogin}>
          <p style={{ color: '#9da5b1', fontSize: '13px' }}>
            ஏற்கனவே கணக்கு உள்ளதா? 
            <span onClick={onGoToLogin} style={loginLink}> லாகின் செய்யவும்</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- CSS STYLES --- */
const mainPageWrapper = { display: 'flex', height: '100vh', background: '#0a0c10', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' };
const loginBox = { width: '420px', padding: '40px', background: '#111418', borderRadius: '24px', border: '1px solid #1f242d', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' };
const loginHeader = { color: '#ffffff', fontSize: '26px', fontWeight: '800', margin: 0 };
const inputGrp = { marginBottom: '20px' };
const labelStyle = { color: '#6c757d', fontSize: '10px', fontWeight: '800', display: 'block', marginBottom: '8px', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '14px', background: '#0a0c10', border: '1px solid #2e353f', borderRadius: '10px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' };
const loginBtn = { width: '100%', padding: '16px', background: '#ffd43b', color: '#000', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize: '15px', marginTop: '10px' };
const backToLogin = { marginTop: '20px', textAlign: 'center' };
const loginLink = { color: '#ffd43b', fontWeight: 'bold', marginLeft: '5px', cursor: 'pointer' };

export default Register;