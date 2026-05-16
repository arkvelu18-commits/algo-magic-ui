import React from 'react';

const Profile = () => {
  // மாதிரி பயனர் தரவு (இதனைப் பிறகு லாகின் சிஸ்டத்துடன் இணைக்கலாம்)
  const userData = {
    name: "Danavriksha User",
    email: "user@example.com",
    refId: "DV2026001",
    joinedDate: "2026-04-15",
    totalReferrals: 5,
    status: "Active"
  };

  const copyToClipboard = () => {
    // உங்கள் பிசினஸ் பிளானுக்கான ரெஃபரல் லிங்க்
    const link = `http://localhost:3000/register?ref=${userData.refId}`;
    navigator.clipboard.writeText(link);
    alert("Referral Link Copied to Clipboard!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 User Profile & Referral</h2>
      
      <div style={styles.contentLayout}>
        {/* இடது பக்கம்: பயனர் சுயவிவரம் */}
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>{userData.name[0]}</div>
            <h3 style={styles.userName}>{userData.name}</h3>
            <span style={styles.badge}>{userData.status}</span>
          </div>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Email Address</label>
              <p style={styles.value}>{userData.email}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Member Since</label>
              <p style={styles.value}>{userData.joinedDate}</p>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Total Network Size</label>
              <p style={styles.value}>{userData.totalReferrals} Members</p>
            </div>
          </div>
        </div>

        {/* வலது பக்கம்: ரெஃபரல் சிஸ்டம் */}
        <div style={styles.refCard}>
          <h3 style={styles.subTitle}>🚀 Grow Your Matrix</h3>
          <p style={styles.desc}>
            உங்கள் ரெஃபரல் லிங்க் மூலம் புதிய நண்பர்களை இணைத்து, லெவல் இன்கம் மற்றும் டைரக்ட் இன்கம் பெறத் தொடங்குங்கள்.
          </p>
          
          <div style={styles.refIdBox}>
            <label style={styles.label}>Your Unique Referral ID</label>
            <h2 style={styles.refIdText}>{userData.refId}</h2>
          </div>

          <div style={styles.linkSection}>
            <p style={styles.label}>Share Referral Link</p>
            <div style={styles.linkBox}>
              <code style={styles.code}>http://localhost:3000/register?ref={userData.refId}</code>
              <button onClick={copyToClipboard} style={styles.copyBtn}>COPY</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// டிசைன் ஸ்டைல்கள் (image_98bc77.png தீம் படி)
const styles = {
  container: { padding: '20px', color: '#fff' },
  title: { color: '#c5a059', marginBottom: '30px', fontWeight: 'bold' },
  contentLayout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  profileCard: { 
    backgroundColor: '#0b1016', 
    padding: '30px', 
    borderRadius: '15px', 
    border: '1px solid #1a1f26', 
    flex: '1', 
    minWidth: '300px' 
  },
  avatarSection: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #1a1f26', paddingBottom: '20px' },
  avatar: { 
    width: '80px', height: '80px', backgroundColor: '#c5a059', borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', 
    color: '#000', fontWeight: 'bold', margin: '0 auto 15px' 
  },
  userName: { margin: '0 0 10px 0', fontSize: '20px' },
  badge: { backgroundColor: '#1a1f26', color: '#4caf50', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  infoItem: { borderBottom: '0.5px solid #1a1f26', paddingBottom: '10px' },
  label: { color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  value: { fontSize: '16px', margin: '5px 0 0 0', color: '#ccc' },
  refCard: { 
    backgroundColor: '#0b1016', 
    padding: '30px', 
    borderRadius: '15px', 
    border: '1px dashed #c5a059', 
    flex: '1.5', 
    minWidth: '350px' 
  },
  subTitle: { color: '#c5a059', marginTop: 0 },
  desc: { color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' },
  refIdBox: { backgroundColor: '#05070a', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '25px' },
  refIdText: { color: '#c5a059', margin: '10px 0 0 0', fontSize: '28px', letterSpacing: '3px' },
  linkSection: { marginTop: '20px' },
  linkBox: { 
    display: 'flex', backgroundColor: '#05070a', padding: '12px', borderRadius: '8px', 
    alignItems: 'center', justifyContent: 'space-between', border: '1px solid #1a1f26' 
  },
  code: { color: '#666', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px' },
  copyBtn: { 
    backgroundColor: '#c5a059', color: '#000', border: 'none', padding: '8px 20px', 
    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' 
  }
};

export default Profile;