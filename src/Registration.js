import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sponsor_id: 'DV2026001', // இது தானாகவே இருக்கும்
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("பதிவு முடிந்தது! இப்போது லாகின் செய்யலாம்.");
        navigate('/login');
      } else {
        alert("பதிவு செய்வதில் பிழை! விவரங்களைச் சரிபார்க்கவும்.");
      }
    } catch (error) {
      alert("சர்வர் இணைப்பில் சிக்கல்!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>NEW REGISTRATION</h2>
        <form onSubmit={handleRegister}>
          <input 
            placeholder="உங்கள் பெயர் (Full Name)" 
            style={styles.input} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="மின்னஞ்சல் (Email)" 
            style={styles.input} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="கடவுச்சொல் (Password)" 
            style={styles.input} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <input 
            value={formData.sponsor_id} 
            style={{...styles.input, backgroundColor: '#1a1f26', color: '#888'}} 
            readOnly 
          />
          <button type="submit" style={styles.btn}>REGISTER NOW</button>
        </form>
        <p style={{color: '#888', marginTop: '15px', cursor: 'pointer'}} onClick={() => navigate('/login')}>
          ஏற்கனவே கணக்கு உள்ளதா? Login
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#05070a', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#0b1016', padding: '30px', borderRadius: '15px', width: '350px', textAlign: 'center', border: '1px solid #1a1f26' },
  title: { color: '#c5a059', marginBottom: '25px', letterSpacing: '2px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #1a1f26', backgroundColor: '#05070a', color: '#fff', outline: 'none' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#c5a059', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Register;