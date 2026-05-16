import React, { useState } from 'react';

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // லோக்கல் பைதான் சர்வர் அட்ரஸ்
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("பதிவு வெற்றிகரமாக முடிந்தது! இப்போது லாகின் செய்யவும்.");
        // App.js-ல் நாம் 'onGoToLogin' என்று கொடுத்துள்ளோம், அதை இங்கே அழைக்கிறோம்
        props.onGoToLogin(); 
      } else {
        alert(data.message || "பதிவு செய்வதில் சிக்கல்!");
      }
    } catch (error) {
      alert("சர்வர் இணைப்பில் சிக்கல்! உங்கள் பைதான் API ஓடுகிறதா எனப் பார்க்கவும்.");
      console.error("Register Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerCard}>
        <h2 style={styles.logo}>CREATE ACCOUNT 🚀</h2>
        <p style={styles.subTitle}>புதிய கணக்கை உருவாக்கவும்</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="உங்கள் பெயர்" style={styles.input} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" style={styles.input} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="மொபைல் எண்" style={styles.input} onChange={handleChange} required />
          <input type="text" name="city" placeholder="ஊர் (City)" style={styles.input} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" style={styles.input} onChange={handleChange} required />
          <button type="submit" style={styles.registerBtn}>REGISTER NOW</button>
        </form>
        <div style={styles.footerText}>
          ஏற்கனவே கணக்கு உள்ளதா? 
          <span onClick={props.onGoToLogin} style={styles.loginLink}> லாகின் செய்ய</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#05070a', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  registerCard: { backgroundColor: '#0b1016', padding: '30px', borderRadius: '15px', border: '1px solid #1a1f26', width: '380px', textAlign: 'center' },
  logo: { color: '#00f2ea', fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' },
  subTitle: { color: '#555', marginBottom: '25px', fontSize: '12px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#05070a', border: '1px solid #1a1f26', borderRadius: '8px', color: '#fff', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' },
  registerBtn: { width: '100%', padding: '15px', backgroundColor: '#00f2ea', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  footerText: { marginTop: '20px', color: '#888', fontSize: '13px' },
  loginLink: { color: '#00f2ea', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline', fontWeight: 'bold' }
};

export default Register;