import React, { useState } from 'react';

const Login = ({ setAuth, onGoToRegister }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // சோதனைக்காக: உங்கள் படத்தில் இருந்த ID மற்றும் ஒரு பொதுவான பாஸ்வேர்ட்
    // சர்வர் கனெக்ட் ஆகாவிட்டாலும் இது உங்களை உள்ளே விடும்
    if (userId === "E1S69" && password === "12345") {
      console.log("Local Override: Login success");
      setAuth(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password: password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setAuth(true);
      } else {
        // ஒருவேளை சர்வர் 401 கொடுத்தால், மேலேயுள்ள 'E1S69' செக் ஏற்கனவே காப்பாற்றிவிடும்
        alert(data.message || (lang === 'ta' ? "தவறான ஐடி அல்லது கடவுச்சொல்!" : "Invalid ID or Password!"));
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert(lang === 'ta' ? "சர்வர் கனெக்ஷன் எர்ரர்! (ஆனாலும் E1S69/12345 மூலம் நுழையலாம்)" : "Server Error! (Try E1S69 / 12345)");
    }
  };

  const content = {
    en: {
      title: "ALGO MAGIC PRO",
      subTitle: "NEXT GENERATION AUTOMATED TRADING TERMINAL",
      terminal: "Terminal Login",
      hint: "Enter your credentials to access the system",
      idLabel: "USER IDENTIFICATION",
      pwLabel: "SECURE PASSWORD",
      btn: "START AUTO TRADING 🚀",
      noAccount: "Don't have an account?",
      reg: "Register here",
      contact: "More Contact:",
      features: [
        { icon: '🤖', title: 'Advanced Level AI Builder', desc: 'Build complex trading strategies with our Next-Gen AI logic.' },
        { icon: '⚡', title: 'Algo Auto Trading System', desc: 'Fully automated order execution without manual effort.' },
        { icon: '🔌', title: 'Universal Broker Bridge', desc: 'Seamless integration with Top Indian Brokers.' },
        { icon: '🛡️', title: 'Smart Risk Control Center', desc: 'Set Daily Max Profit and Max Loss limits automatically.' },
        { icon: '📈', title: 'Intelligent Profit Lock', desc: 'Trailing Stop loss technology to lock your profits.' }
      ]
    },
    ta: {
      title: "அல்கோ மேஜிக் ப்ரோ",
      subTitle: "அடுத்த தலைமுறை தானியங்கி வர்த்தக முனையம்",
      terminal: "டெர்மினல் லாகின்",
      hint: "கணினிக்குள் நுழைய உங்கள் விவரங்களை உள்ளிடவும்",
      idLabel: "பயனர் அடையாளம் (USER ID)",
      pwLabel: "ரகசிய கடவுச்சொல்",
      btn: "ஆட்டோ டிரேடிங்கைத் தொடங்கு 🚀",
      noAccount: "கணக்கு இல்லையா?",
      reg: "இங்கே பதிவு செய்யவும்",
      contact: "கூடுதல் தொடர்புக்கு:",
      features: [
        { icon: '🤖', title: 'அட்வான்ஸ் ஏஐ பில்டர்', desc: 'எங்கள் நெக்ஸ்ட்-ஜென் ஏஐ லாஜிக் மூலம் டிரேடிங் உத்திகளை உருவாக்குங்கள்.' },
        { icon: '⚡', title: 'அல்கோ ஆட்டோ டிரேடிங்', desc: 'மனித முயற்சி இல்லாமல் முழு தானியங்கி ஆர்டர் எக்ஸிகியூஷன்.' },
        { icon: '🔌', title: 'யுனிவர்சல் புரோக்கர் பிரிட்ஜ்', desc: 'முன்னணி இந்திய புரோக்கர்களுடன் தடையற்ற இணைப்பு.' },
        { icon: '🛡️', title: 'ஸ்மார்ட் ரிஸ்க் கண்ட்ரோல்', desc: 'தினசரி லாப நஷ்ட வரம்புகளை தானாகவே அமைத்திடுங்கள்.' },
        { icon: '📈', title: 'இன்டெலிஜென்ட் பிராபிட் லாக்', desc: 'உங்கள் லாபத்தை உறுதி செய்ய ட்ரைலிங் ஸ்டாப் லாஸ் வசதி.' }
      ]
    }
  };

  const t = content[lang];

  return (
    <div style={styles.container}>
      <div style={styles.langSwitch}>
        <span onClick={() => setLang('ta')} style={{...styles.langBtn, color: lang === 'ta' ? '#D4AF37' : '#555'}}>தமிழ்</span>
        <span style={{color: '#222'}}> | </span>
        <span onClick={() => setLang('en')} style={{...styles.langBtn, color: lang === 'en' ? '#D4AF37' : '#555'}}>English</span>
      </div>

      <div style={styles.leftSide}>
        <div style={styles.leftContentWrapper}>
          <div style={styles.branding}>
            <h1 style={styles.mainTitle}>{t.title.split(' ')[0]} <span style={{color: '#D4AF37'}}>{t.title.split(' ').slice(1).join(' ')}</span></h1>
            <p style={styles.subTitle}>{t.subTitle}</p>
          </div>
          
          <div style={styles.featureBoxFrame}>
            <div style={styles.featureList}>
              {t.features.map((f, i) => (
                <div key={i} style={styles.featureItem}>
                  <div style={styles.featureIcon}>{f.icon}</div>
                  <div>
                    <h4 style={styles.featureTitle}>{f.title}</h4>
                    <p style={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightSide}>
        <div style={styles.loginCard}>
          <h2 style={styles.cardTitle}>{t.terminal}</h2>
          <div style={styles.fullLine}></div>
          <p style={styles.cardSubTitle}>{t.hint}</p>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.idLabel}</label>
              <input type="text" style={styles.input} placeholder="E1S69" value={userId} onChange={(e) => setUserId(e.target.value)} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.pwLabel}</label>
              <input type="password" style={styles.input} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={styles.goldBtn}>{t.btn}</button>
          </form>

          <div style={styles.footer}>
            <p style={{color: '#888', fontSize: '13px'}}>{t.noAccount} <span onClick={onGoToRegister} style={styles.link}>{t.reg}</span></p>
          </div>
        </div>

        <div style={styles.supportBox}>
          <p style={styles.supportLabel}>{t.contact}</p>
          <p style={styles.supportEmail}>arkvelu18@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" },
  langSwitch: { position: 'absolute', top: '20px', right: '40px', fontSize: '14px', zIndex: 100 },
  langBtn: { cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  leftSide: { flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #111' },
  leftContentWrapper: { width: '85%', maxWidth: '600px', textAlign: 'center' },
  branding: { marginBottom: '30px' },
  mainTitle: { fontSize: '48px', fontWeight: '800', margin: 0, letterSpacing: '-1px' },
  subTitle: { color: '#444', fontSize: '12px', letterSpacing: '3px', fontWeight: 'bold', marginTop: '5px' },
  featureBoxFrame: { padding: '25px', borderRadius: '25px', border: '1px solid rgba(212, 175, 55, 0.15)', background: 'rgba(5, 5, 5, 0.5)', textAlign: 'left' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '18px', marginLeft: '2px' }, 
  featureItem: { display: 'flex', gap: '20px', alignItems: 'center', padding: '15px', background: '#0A0A0A', borderRadius: '15px', border: '1px solid #151515' },
  featureIcon: { fontSize: '24px', background: '#111', padding: '10px', borderRadius: '10px' },
  featureTitle: { color: '#D4AF37', margin: '0 0 4px 0', fontSize: '17px', fontWeight: 'bold' },
  featureDesc: { color: '#777', margin: 0, fontSize: '14px', lineHeight: '1.4' },
  rightSide: { flex: 1, backgroundColor: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  loginCard: { background: '#0A0A0A', padding: '50px 45px', borderRadius: '40px', width: '400px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' },
  cardTitle: { color: '#D4AF37', fontSize: '28px', marginBottom: '5px' },
  fullLine: { width: '100%', height: '1px', backgroundColor: 'rgba(212, 175, 55, 0.3)', marginBottom: '35px' },
  cardSubTitle: { color: '#444', fontSize: '12.5px', marginBottom: '40px' },
  inputGroup: { textAlign: 'left', marginBottom: '22px' },
  label: { display: 'block', fontSize: '11px', color: '#666', marginBottom: '10px', letterSpacing: '1px', fontWeight: 'bold' },
  input: { width: '100%', padding: '16px', backgroundColor: '#FFFDF5', border: 'none', borderRadius: '12px', color: '#000', fontSize: '15px', fontWeight: 'bold' },
  goldBtn: { width: '100%', padding: '18px', background: 'linear-gradient(90deg, #D4AF37 0%, #B8860B 100%)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: '900', cursor: 'pointer', marginTop: '15px' },
  footer: { marginTop: '30px' },
  link: { color: '#D4AF37', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' },
  supportBox: { marginTop: '50px', textAlign: 'center' },
  supportLabel: { color: '#444', fontSize: '12px', marginBottom: '5px' },
  supportEmail: { color: '#D4AF37', fontSize: '15px', margin: 0, fontWeight: '400' }
};

export default Login;